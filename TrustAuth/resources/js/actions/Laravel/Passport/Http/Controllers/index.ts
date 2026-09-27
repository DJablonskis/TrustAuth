import AccessTokenController from './AccessTokenController'
import DeviceUserCodeController from './DeviceUserCodeController'
import DeviceCodeController from './DeviceCodeController'
import TransientTokenController from './TransientTokenController'
import DenyAuthorizationController from './DenyAuthorizationController'
import DeviceAuthorizationController from './DeviceAuthorizationController'
import ApproveDeviceAuthorizationController from './ApproveDeviceAuthorizationController'
import DenyDeviceAuthorizationController from './DenyDeviceAuthorizationController'

const Controllers = {
    AccessTokenController: Object.assign(AccessTokenController, AccessTokenController),
    DeviceUserCodeController: Object.assign(DeviceUserCodeController, DeviceUserCodeController),
    DeviceCodeController: Object.assign(DeviceCodeController, DeviceCodeController),
    TransientTokenController: Object.assign(TransientTokenController, TransientTokenController),
    DenyAuthorizationController: Object.assign(DenyAuthorizationController, DenyAuthorizationController),
    DeviceAuthorizationController: Object.assign(DeviceAuthorizationController, DeviceAuthorizationController),
    ApproveDeviceAuthorizationController: Object.assign(ApproveDeviceAuthorizationController, ApproveDeviceAuthorizationController),
    DenyDeviceAuthorizationController: Object.assign(DenyDeviceAuthorizationController, DenyDeviceAuthorizationController),
}

export default Controllers