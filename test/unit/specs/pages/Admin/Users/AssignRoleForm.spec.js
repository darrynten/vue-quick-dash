import AssignRoleForm from '@/pages/Admin/Users/AssignRoleForm.vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import * as RolesApi from '@/api/admin/roles'
import sinon from 'sinon'
import { ToasterEvents } from '@unicorns/toaster'
import Vue from 'vue'

describe('AssignRoleForm', () => {
  it('emits success event', async () => {
    const localVue = createLocalVue()

    const form = shallowMount(AssignRoleForm, {
      localVue,
      propsData: {
        user: {_id: '82923232'},
        roles: []
      },
      mocks: {
        $toaster: ToasterEvents
      }
    })

    Vue.axios = {
      post: sinon.stub().resolves({
        data: {
          status: 'ok'
        }
      })
    }

    form.setData({currentRoleId: 'successroleid'})

    const assignRole = sinon.stub(RolesApi, 'assignRole').resolves({status: 'ok'})

    await form.vm.assignRole().then((result) => {
      expect(form.emitted()).to.have.key('success')
      sinon.assert.called(Vue.axios.post)
      assignRole.restore()
    })
  })

  it('emits error event', async () => {
    const localVue = createLocalVue()
    const toastSpy = {
      addToast: sinon.stub().returns(true)
    }

    const form = shallowMount(AssignRoleForm, {
      localVue,
      propsData: {
        user: {_id: '82923232'},
        roles: []
      },
      mocks: {
        $toaster: toastSpy
      }
    })

    form.setData({currentRoleId: 'notokrole'})

    Vue.axios = {
      post: sinon.stub().rejects({
        data: {
          status: 'nok'
        }
      })
    }

    await form.vm.assignRole().then(() => {
      expect(toastSpy.addToast.called).to.equal(true)
      expect(form.vm.sending).to.equal(false)
      expect(form.emitted()).to.have.key('error')
    })
  })
})
