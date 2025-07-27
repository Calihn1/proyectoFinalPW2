from rest_framework import permissions

class ListarEditarRestriccion (permissions.BasePermission):
    
    def has_permission(self, request, view):
       user = request.user
       
       if request.method in ['GET', 'PUT', 'PATCH', 'DELETE']:
           return user.rol in ['admin', 'propietario']
       
       return False
    
    def has_object_permission(self, request, view, obj):
        user = request.user

        if request.method in ['PUT', 'PATCH', 'DELETE']:
            rol = request.data.get('rol', obj.rol)

            if user.rol == 'admin' and obj.rol == 'vendedor':
                return rol == 'vendedor'
            
            if user.rol == 'propietario' and not obj.rol == 'propietario':
                return rol in ['admin', 'vendedor']
            
            return False
        
        if request.method == 'GET':
            return user.rol in ['admin', 'propietario']
        
        return False