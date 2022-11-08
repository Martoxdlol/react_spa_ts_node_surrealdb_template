import { AppStrings } from "../internationalization";

export const errorStrings = new AppStrings({
    'auth_error': {
        'es': 'Error de autenticación, debes iniciar sesión',
        'en': 'Authtentication error, must login',
    },
    'permission_error': {
        'es': 'No tiene permiso para acceder a este recurso',
        'en': 'You don\'t have permission to access this resource' 
    },
    'network_error': {
        'es': 'Error de red, revise la conexión',
        'en': 'Network error, check connection' 
    },
    'unknown_error': {
        'es': 'Error desconocido',
        'en': 'Unknown error'
    },
    'internal_error': {
        'es': 'Error interno',
        'en': 'Internal error'
    }
}) 