import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Calendar from '../../src/components/Calendar.vue'

describe('Calendar.vue', () => {
  const calendar = shallowMount(Calendar, {
    propsData: {
      monthDate: new Date(),
      showWeekNumbers: true,
    }
  })

  it('should open calendar at the specified month date', () => {
    const date = new Date()
    expect((calendar.vm as any).currentMonthDate.getFullYear()).to.equal(date.getFullYear())
    expect((calendar.vm as any).currentMonthDate.getMonth()).to.equal(date.getMonth())
  })
})