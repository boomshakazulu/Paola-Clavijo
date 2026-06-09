import {defineField, defineType} from 'sanity'

export const briefAboutMeType = defineType({
  name: 'briefAboutMe',
  title: 'Brief About Me',
  type: 'document',
  fields: [
    defineField({
      name: 'mainText',
      type: 'text',
    }),
    defineField({
      name: 'subText',
      type: 'text',
    }),
  ],
})
