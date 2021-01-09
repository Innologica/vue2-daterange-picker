import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Calendar from '../../src/components/Calendar'

describe('Calendar.vue', () => {
  let calendar = shallowMount(Calendar, {
    propsData: {
      monthDate: new Date(),
      showWeekNumbers: true,
    }
  })

  it('should open calendar at the specified month date', () => {
    const date = new Date()
    expect(calendar.vm.currentMonthDate.getFullYear()).to.equal(date.getFullYear())
    expect(calendar.vm.currentMonthDate.getMonth()).to.equal(date.getMonth())
  })
})