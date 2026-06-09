import {defineField, defineType} from 'sanity'

export const showreelVideoType = defineType({
  name: 'showreelVideo',
  title: 'Showreel Video',
  type: 'document',
  fields: [
    defineField({
      name: 'video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    }),
  ],
})
