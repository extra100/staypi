import { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGetoutletsQuery } from '../hooks/outletHooks'
import { useSignupMutation } from '../hooks/userHooks'
import { Store } from '../Store'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'

export default function SignupPage() {
  const { data: outletsData } = useGetoutletsQuery()

  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [id_outlet, setIdOutlet] = useState('') // Add this line
  console.log({ id_outlet })
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  const { mutateAsync: signup, isLoading } = useSignupMutation()

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const data = await signup({
        name,
        email,
        id_outlet,
        password,
      })
      dispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate(redirect)
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="id_outlet">
          <Form.Label>Outlet</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setIdOutlet(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Outlet
            </option>
            {outletsData &&
              outletsData.map((outlet) => (
                <option key={outlet.id_outlet} value={outlet.id_outlet}>
                  {outlet.nama_outlet}
                </option>
              ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>

        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
        </div>
      </Form>
    </Container>
  )
}
