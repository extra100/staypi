import { useContext, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import UserContext from '../contexts/UserContext'
import { useGetoutletsQuery } from '../hooks/outletHooks'
import { useUpdateProfileMutation } from '../hooks/userHooks'
import { Store } from '../Store'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'

export default function ProfilePage() {
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const [name, setName] = useState(userInfo!.name)
  const [email, setEmail] = useState(userInfo!.email)
  const [id_outlet, setIdOutlet] = useState(userInfo!.id_outlet)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { mutateAsync: updateProfile, isLoading } = useUpdateProfileMutation()
  const { data: outletsData } = useGetoutletsQuery()
  console.log({ outletsData })

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      const data = await updateProfile({
        name,
        email,
        id_outlet,
        password,
      })
      dispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      toast.success('User updated successfully')
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }
  function getOutletNameById(Jack: string) {
    if (outletsData) {
      const outlet = outletsData.find((outlet) => outlet._id === Jack)
      return outlet ? outlet.nama_outlet : 'Outlet tidak ditemukan'
    }
    return 'Memuat...'
  }

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="id_outlet">
          <Form.Label>Outlet</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setIdOutlet(e.target.value)}
            required
            disabled
          >
            <option value="" disabled>
              Select Outlet
            </option>

            {Array.isArray(outletsData) &&
              outletsData.map((outlet) => (
                <option key={outlet._id} value={outlet._id}>
                  {outlet.nama_outlet}
                </option>
              ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <div className="mb-3">
          <Button disabled={isLoading} type="submit">
            Update
          </Button>
          {isLoading && <LoadingBox></LoadingBox>}
        </div>
      </form>
    </div>
  )
}
