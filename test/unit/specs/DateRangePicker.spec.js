import Vue from 'vue'
import DateRangePicker from '@/components/DateRangePicker'

// helper function that mounts and returns the rendered text
function getRenderedComponent (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData: propsData }).$mount()
  return vm
}

describe('DateRangePicker.vue', () => {
  let vm = getRenderedComponent(DateRangePicker, {})
  let dt = new Date()

  it('should render correct contents', () => {
    expect(vm.$el.querySelector('.reportrange-text span').textContent)
      .to.equal(dt.toLocaleDateString() + ' - ' + dt.toLocaleDateString())
  })

  it('should have startDate and endDate props set to Date instances', () => {
    expect(vm.startDate)
      .to.be.a('Date')
    expect(vm.endDate)
      .to.be.a('Date')
  })

  it('should be hidden', () => {
    expect(vm.$el.querySelector('div.daterangepicker'))
      .to.equal(null)
  })

  it('should open when clicked', (done) => {
    vm.open = true

    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.daterangepicker'))
        .to.not.be.empty()
      done()
    })
  })

  it('should select the dates passed by props "2017-09-19" - "2017-10-09"', () => {
    vm.startDate = '2017-09-19'
    vm.endDate = '2017-10-09'

    Vue.nextTick(() => {
      expect(vm.$el.querySelectorAll('.in-range'))
        .to.have.length(16)

      expect(vm.start.toLocaleDateString())
        .to.equal('19/9/2017')

      expect(vm.end.toLocaleDateString())
        .to.equal('9/10/2017')

      done()
    })
  })

})
