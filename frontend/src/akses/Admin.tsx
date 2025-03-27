import { useUser } from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'

const Admin = (WrappedComponent: any) => {
  return (props: any): any => {
    const { user } = useUser()
    const navigate = useNavigate()

    if (!user || user.id_outlet !== 'admin') {
      navigate('/login')
      return null
    }

    return <WrappedComponent {...props} />
  }
}

export default Admin
