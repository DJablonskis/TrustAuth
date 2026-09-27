import CustomAuthorizationController from './CustomAuthorizationController'
import CustomApproveAuthorizationController from './CustomApproveAuthorizationController'
import PersonaController from './PersonaController'
import VerificationController from './VerificationController'
import GovernanceController from './GovernanceController'
import AuthController from './AuthController'
import AdminGovernanceController from './AdminGovernanceController'

const Controllers = {
    CustomAuthorizationController: Object.assign(CustomAuthorizationController, CustomAuthorizationController),
    CustomApproveAuthorizationController: Object.assign(CustomApproveAuthorizationController, CustomApproveAuthorizationController),
    PersonaController: Object.assign(PersonaController, PersonaController),
    VerificationController: Object.assign(VerificationController, VerificationController),
    GovernanceController: Object.assign(GovernanceController, GovernanceController),
    AuthController: Object.assign(AuthController, AuthController),
    AdminGovernanceController: Object.assign(AdminGovernanceController, AdminGovernanceController),
}

export default Controllers