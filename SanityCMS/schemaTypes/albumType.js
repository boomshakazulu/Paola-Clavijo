import {defineField, defineType} from 'sanity'

export const albumType = defineType({
  name: 'album',
  title: 'Album',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'yearTaken',
      type: 'number',
    }),
    defineField({
      name: 'coverPhoto',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'photos',
      type: 'array',
      of: [
        {
          type: 'image',
        },
      ],
    }),
  ],
})
