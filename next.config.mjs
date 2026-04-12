// /** @type {import('next').NextConfig} */
// const nextConfig = {
  
//   // basePath: '/react', // Uncomment if the repository name is 'react'
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  basePath: '/jope',
}

export default nextConfig