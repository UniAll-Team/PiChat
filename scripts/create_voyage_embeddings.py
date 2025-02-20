from __future__ import annotations

from io import BytesIO
import os
from math import ceil, sqrt
import base64

from PIL import Image
from dotenv import load_dotenv
from loguru import logger
from supabase import create_client
from voyageai import Client


class VoyageEmbeddingProcessor:
    BATCH_SIZE = 10  # Process images in batches to avoid rate limits
    MAX_PIXELS = 16_000_000  # 16M pixels
    MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB

    def __init__(self):
        # Load environment variables
        load_dotenv(override=True)

        # Initialize clients
        self.supabase = create_client(
            os.getenv('SUPABASE_URL'),
            os.getenv(
                'SUPABASE_SERVICE_KEY'
            ),  # Using service role key for admin access
        )
        self.voyage = Client(api_key=os.getenv('VOYAGE_API_KEY'))

        # Initialize counters
        self.processed_count = 0
        self.failed_count = 0

    def get_signed_urls(self, *names):
        """Get a signed URL for an image in the storage bucket."""
        response = self.supabase.storage.from_('images').create_signed_urls(
            names, 60 * 60
        )
        return [data['signedUrl'] for data in response]

    def create_voyage_embeddings(self, image_urls):
        """Create embeddings for images using the Voyage API."""
        try:
            result = self.voyage.multimodal_embed(
                inputs=[
                    {'content': [{'type': 'image_url', 'image_url': url}]}
                    for url in image_urls
                ],
                input_type='document',
                model='voyage-multimodal-3',
            )
            return result.embeddings
        except Exception:
            logger.exception('')

    def create_voyage_embeddings_base64(self, base64_images):
        """Create embeddings for base64 encoded images using the Voyage API."""
        try:
            result = self.voyage.multimodal_embed(
                inputs=[
                    {
                        'content': [
                            {
                                'type': 'image_base64',
                                'image_base64': f'data:image/jpeg;base64,{img}',
                            }
                        ]
                    }
                    for img in base64_images
                ],
                input_type='document',
                model='voyage-multimodal-3',
            )
            return result.embeddings
        except Exception:
            logger.exception('')

    def update_image_embeddings(self, names, voyage_embeddings):
        """Update the voyage_embeddings for images in the database."""
        for name, embedding in zip(names, voyage_embeddings):
            response = (
                self.supabase.table('images')
                .update({'voyage_embedding': embedding})
                .eq('name', name)
                .execute()
            )

            if 'error' in response:
                logger.error(f'Error updating embedding: {response["error"]}')
                self.failed_count += 1
            else:
                self.processed_count += 1
                logger.info(f'Successfully processed {name}')

    def resize_image(self, image_data):
        """Resize image to fit within pixel and size limits."""
        img = Image.open(BytesIO(image_data))

        # Calculate current pixels
        current_pixels = img.width * img.height
        # Calculate scale to reduce pixels to MAX_PIXELS
        factor = sqrt(current_pixels / self.MAX_PIXELS)
        # Resize image
        img = img.reduce(ceil(factor))

        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        # Save with quality adjustment if needed
        output = BytesIO()
        quality = 100
        while True:
            quality -= 5
            output.seek(0)
            output.truncate()
            img.save(output, format='JPEG', optimize=True, quality=quality)

            if output.tell() <= self.MAX_FILE_SIZE:
                break

        return output.getvalue()

    def process_normal_sized_images(self):
        """Process images that are within size limits."""
        response = (
            self.supabase.table('normal_sized_images')
            .select('name')
            .is_('voyage_embedding', 'null')
            .execute()
        )

        if 'error' in response:
            msg = f'Error fetching normal sized images: {response["error"]}'
            raise msg

        images = response.data
        logger.info(f'Found {len(images)} normal sized images without embeddings')

        for i in range(0, len(images), self.BATCH_SIZE):
            batch = images[i : i + self.BATCH_SIZE]
            logger.info(
                f'Processing normal sized batch {i // self.BATCH_SIZE + 1}/{(len(images) + self.BATCH_SIZE - 1) // self.BATCH_SIZE}'
            )
            image_names = [img['name'] for img in batch]
            signed_urls = self.get_signed_urls(*image_names)
            embeddings = self.create_voyage_embeddings(signed_urls)
            self.update_image_embeddings(image_names, embeddings)

    def process_oversized_images(self):
        """Process images that exceed size limits."""
        response = (
            self.supabase.table('oversized_images')
            .select('name')
            .is_('voyage_embedding', 'null')
            .execute()
        )

        if 'error' in response:
            msg = f'Error fetching oversized images: {response["error"]}'
            raise msg

        images = response.data
        logger.info(f'Found {len(images)} oversized images without embeddings')

        for i in range(0, len(images), self.BATCH_SIZE):
            batch = images[i : i + self.BATCH_SIZE]
            logger.info(
                f'Processing oversized batch {i // self.BATCH_SIZE + 1}/{(len(images) + self.BATCH_SIZE - 1) // self.BATCH_SIZE}'
            )

            base64_images = []
            image_names = []

            for img in batch:
                try:
                    # Get image data
                    response = self.supabase.storage.from_('images').download(
                        img['name']
                    )

                    # Resize image
                    resized_image = self.resize_image(response)

                    # Convert to base64
                    base64_image = base64.b64encode(resized_image).decode('utf-8')
                    base64_images.append(base64_image)
                    image_names.append(img['name'])
                except Exception:
                    logger.exception('')
                    self.failed_count += 1
                    continue

            if base64_images:
                embeddings = self.create_voyage_embeddings_base64(base64_images)
                self.update_image_embeddings(image_names, embeddings)

    def process_images(self):
        """Process all images without voyage embeddings."""
        logger.info('Starting to process normal sized images...')
        self.process_normal_sized_images()

        logger.info('Starting to process oversized images...')
        self.process_oversized_images()

        logger.info('Processing complete!')
        logger.info(f'Successfully processed: {self.processed_count} images')
        logger.info(f'Failed to process: {self.failed_count} images')


def main():
    processor = VoyageEmbeddingProcessor()
    processor.process_images()


if __name__ == '__main__':
    main()
