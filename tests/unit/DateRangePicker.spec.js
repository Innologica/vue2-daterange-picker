import { expect } from 'chai'
import DateRangePicker from '@/components/DateRangePicker'
import dateUtil from '../../src/components/date_util/native'
import { mount } from '@vue/test-utils'

const propsData = {
  dateRange: {
    startDate: '2017-09-19',
    endDate: '2017-10-09'
  },
  showWeekNumbers: true,
}

describe('DateRangePicker.vue', () => {
  let wrapper = mount(DateRangePicker, { propsData })
  const vm = wrapper.vm
  let dt_start = new Date(propsData.dateRange.startDate)
  let dt_end = new Date(propsData.dateRange.endDate)

  let dt_start_text = dateUtil.format(dt_start, vm.locale.format)
  let dt_end_text = dateUtil.format(dt_end, vm.locale.format)

  it('should render correct contents', () => {
    expect(vm.$el.querySelector('.reportrange-text span').textContent)
      .to.equal(dt_start_text + vm.locale.separator + dt_end_text)
  })

  it('should be hidden', () => {
    expect(vm.$el.querySelector('.daterangepicker'))
      .to.equal(null)
  })

  it('should open when clicked', (done) => {
    vm.open = true

    vm.$nextTick(() => {
      expect(vm.$el.querySelector('.daterangepicker'))
        .to.not.be.empty
      done()
    })
  })

  it('should select the dates passed by props "1981-11-24" - "2018-10-09"', (done) => {
    wrapper.setProps({
      dateRange: {
        startDate: '1981-11-24',
        endDate: '2018-10-09'
      }
    })

    vm.$nextTick(() => {
      // console.error(vm.start, vm.dateRange)
      expect(dateUtil.isSame(vm.start, '1981-11-24', 'date')).to.equal(true)
      expect(dateUtil.isSame(vm.end, '2018-10-09', 'date')).to.equal(true)

      done()
    })
  })

  //bugs
  it('getMonth is not a function #40 - select month before the start date', () => {
    vm.startDate = propsData.startDate
    vm.endDate = propsData.endDate
    vm.changeRightMonth({month: 1, year: 2017})

    expect(vm.nextMonthDate.getMonth()).to.equal(0)
    expect(vm.nextMonthDate.getFullYear()).to.equal(2017)
  })

  it('Cleared state / null value? #41 - should be able to set null value', (done) => {
    wrapper.setProps({ dateRange: { startDate: null, endDate: null } })
    vm.$nextTick(() => {
      expect(vm.start).to.equal(null)
      expect(vm.end).to.equal(null)

      expect(vm.startText).to.equal("")
      expect(vm.endText).to.equal("")
      expect(vm.rangeText).to.equal(vm.locale.separator)
      done()
    })
  })

  it('should not fill time when no date is selected #153', (done) => {
    wrapper.setProps({ dateRange: { startDate: null, endDate: null }, timePicker: true })
    vm.open = true
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('.daterangepicker'))
        .to.not.be.empty
      expect(vm.start).to.equal(null)
      expect(vm.end).to.equal(null)
      console.log(vm.$el.querySelector('.calendar-time'))
      expect(vm.$el.querySelector('.calendar-time'))
        .to.equal(null)
      done()
    })
  })
})

describe('DateRangePicker.vue MIN/MAX', () => {
  const wrapper = mount(DateRangePicker, { propsData: {
      dateRange: {
        startDate: '2017-09-19',
        endDate: '2017-10-09'
      },
      minDate: '2016-09-02',
      maxDate: '2019-10-02',
      showDropdowns: true,
    }
  })
  const vm = wrapper.vm

  it('should not be able to navigate outside of min/max values', (done) => {
    //the input is missing when not open
    expect(vm.$el.querySelector('.yearselect')).to.equal(null)
    expect(vm.monthDate.getFullYear()).to.equal(2017)

    wrapper.setData({open: true})

    vm.$nextTick(() => {
      const input = wrapper.find('.yearselect')
      input.setValue(2016)

      vm.$nextTick(() => {
        expect(vm.monthDate.getFullYear()).to.equal(2016)
        done()
      })

    })
  })

  it('cannot select before min date', (done) => {
    const input = wrapper.find('.yearselect')

    input.setValue(2015)

    vm.$nextTick(() => {
      expect(vm.monthDate.getFullYear()).to.equal(2016)
      done()
    })
  })
})

describe('DateRangePicker.vue DEMO', () => {
  const wrapper = mount(DateRangePicker, {
    propsData: {
      dateRange: {
        startDate: '2019-12-10',
        endDate: '2019-12-20'
      },
      minDate: '2019-05-02 04:00:00',
      maxDate: '2020-02-26 14:00:00',
      showDropdowns: true,
      ranges: {
        'This year': [new Date(2019, 0, 1), new Date(2019, 11, 31)],
      }
    }
  })
  const vm = wrapper.vm

  it('should be able to change to next month', (done) => {
    vm.togglePicker(true)
    vm.$nextTick(() => {
      const input = wrapper.find('.drp-calendar.left .next')
      expect(input.is('th')).to.equal(true)
      input.trigger('click')
      expect(vm.monthDate.getDate()).to.equal(1)
      expect(vm.monthDate.getMonth()).to.equal(0)
      expect(vm.monthDate.getFullYear()).to.equal(2020)

      //second click should be restrained by min/max
      input.trigger('click')
      expect(vm.monthDate.getDate()).to.equal(1)
      expect(vm.monthDate.getMonth()).to.equal(0)
      expect(vm.monthDate.getFullYear()).to.equal(2020)

      done()
    })
  })

  it('should select in the scope of min/max date when choosing from ranges', async () => {
    vm.togglePicker(true)
    await vm.$nextTick()
    const range_li = wrapper.find('li[data-range-key="This year"]')
    expect(range_li.text()).to.equal('This year')
    range_li.trigger('click')
    await vm.$nextTick()

    expect(vm.start.getHours()).to.equal(4)
    expect(vm.start.getDate()).to.equal(2)
    expect(vm.start.getMonth()).to.equal(4)
    expect(vm.start.getFullYear()).to.equal(2019)
  })

  it('should select correct initial date - #114', async () => {
    const range_li = wrapper.find('li[data-range-key="This year"]')
    const minMax = {
      dateRange: {
        startDate: '2019-05-10',
        endDate: '2019-10-10'
      },
      minDate: '2016-09-02',
      maxDate: '2020-10-02'
    }
    wrapper.setProps(minMax);
    await vm.$nextTick()

    expect(vm.min.getDate()).to.equal(2)
    expect(vm.min.getMonth()).to.equal(8)
    expect(vm.min.getFullYear()).to.equal(2016)

    expect(vm.max.getDate()).to.equal(2)
    expect(vm.max.getMonth()).to.equal(9)
    expect(vm.max.getFullYear()).to.equal(2020)

    range_li.trigger('click')
    await vm.$nextTick()
    //check selected dates
    expect(vm.start.getDate()).to.equal(1)
    expect(vm.start.getMonth()).to.equal(0)
    expect(vm.start.getFullYear()).to.equal(2019)

    expect(vm.end.getDate()).to.equal(31)
    expect(vm.end.getMonth()).to.equal(11)
    expect(vm.end.getFullYear()).to.equal(2019)

    //check current month dates
    expect(vm.monthDate.getDate()).to.equal(1)
    expect(vm.monthDate.getMonth()).to.equal(0)
    expect(vm.monthDate.getFullYear()).to.equal(2019)

    expect(vm.nextMonthDate.getDate()).to.equal(1)
    expect(vm.nextMonthDate.getMonth()).to.equal(1)
    expect(vm.nextMonthDate.getFullYear()).to.equal(2019)
  })
})

describe('DateRangePicker Calendar months positioning', () => {
  let dateRange = {startDate: new Date(2020,4, 18), endDate: new Date(2020,4,24)}
  const wrapper = mount(DateRangePicker, { propsData: { dateRange } })
  const vm = wrapper.vm

  it('should be able to change to next month', (done) => {
    vm.togglePicker(true)
    vm.$nextTick(() => {
      const input = wrapper.find('.drp-calendar.right .next')
      expect(input.is('th')).to.equal(true)
      input.trigger('click')
      expect(vm.monthDate.getDate()).to.equal(1)
      expect(vm.monthDate.getMonth()).to.equal(5)
      expect(vm.monthDate.getFullYear()).to.equal(2020)

      done()
    })
  })

  it('should locate correct month of the selected range', (done) => {
    const range = wrapper.find('[data-range-key="Today"]')
    range.trigger('click')

    vm.$nextTick(() => {
      // expect(vm.monthDate.getDate()).to.equal(dateRange.startDate.getDate())
      expect(vm.monthDate.getMonth(), 'Same month').to.equal(vm.ranges.Today[0].getMonth())
      expect(vm.monthDate.getFullYear(), 'Same year').to.equal(vm.ranges.Today[0].getFullYear())

      done()
    })

  })

})


describe('DateRangePicker Calendar months positioning with linkedCalendars false', () => {
  let dateRange = {startDate: new Date(2020,4, 18), endDate: new Date(2020,4,24)}
  const wrapper = mount(DateRangePicker, { propsData: { dateRange, linkedCalendars: false } })
  const vm = wrapper.vm

  it('should locate correct month and next month of the selected range', (done) => {
    vm.togglePicker(true)

    vm.$nextTick(() => {

      const range = wrapper.find('[data-range-key="This year"]')
      range.trigger('click')

      vm.$nextTick(() => {
        expect(vm.monthDate.getMonth(), 'Same month').to.equal(vm.ranges["This year"][0].getMonth())
        expect(vm.monthDate.getFullYear(), 'Same year').to.equal(vm.ranges["This year"][0].getFullYear())

        expect(vm.nextMonthDate.getMonth(), 'Same month').to.equal(vm.ranges["This year"][1].getMonth())
        expect(vm.nextMonthDate.getFullYear(), 'Same year').to.equal(vm.ranges["This year"][1].getFullYear())

        done()
      })

    })

  })

})
