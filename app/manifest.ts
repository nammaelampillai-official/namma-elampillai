import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Namma Elampillai',
        short_name: 'Namma Elampillai',
        description: 'Authentic Elampillai Silk Sarees directly from weavers.',
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFDD0',
        theme_color: '#800000',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
