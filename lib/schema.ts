export interface SchemaProps {
  toolName: string;
  slug: string;
  targetKB?: number;
  dimensions?: string;
  description?: string;
}

export function generateFAQSchema({ toolName, targetKB = 50, dimensions }: SchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the required file size for ${toolName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The required file size is strictly under ${targetKB} KB${
            dimensions ? ` with recommended dimensions of ${dimensions}` : ''
          }. Formilo compresses and formats it accurately for official recruitment portals.`
        }
      },
      {
        '@type': 'Question',
        name: `Is this ${toolName} safe and free to use?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, 100% free and private. Formilo runs purely in your device browser memory (Client-Side RAM). Your photos and signatures are never uploaded to any remote server.`
        }
      },
      {
        '@type': 'Question',
        name: `How do I compress my file using ${toolName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Simply upload your image, adjust the target size slider to ${targetKB} KB, preview the real-time file size, and tap download.`
        }
      }
    ]
  };
}

export function generateAppSchema({ toolName, slug, description }: SchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: toolName,
    url: `https://www.formilo.in${slug.startsWith('/') ? slug : `/${slug}`}`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR'
    },
    description: description || `Free client-side online tool to resize, crop and format files for ${toolName}.`
  };
}
