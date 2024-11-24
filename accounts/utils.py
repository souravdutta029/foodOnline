

def detectUser(user):
    if user.role == 1:
        redirecturl = 'vendorDashboard'
    elif user.role == 2:
        redirecturl = 'custDashboard'
    elif user.role is None and user.is_superadmin:
        redirecturl = '/admin'
    return redirecturl