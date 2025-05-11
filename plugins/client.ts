export default defineNuxtPlugin(() => {
  return {
    provide: {
      client: process.client
    }
  }
}) 