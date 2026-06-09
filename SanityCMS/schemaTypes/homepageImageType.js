import {defineField, defineType} from 'sanity'

export const homepageImageType = defineType({
  name: 'homepageImage',
  title: 'Homepage Image',
  type: 'document',
  fields: [
    defineField({
      name: 'photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'fog',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
