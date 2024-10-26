import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import TOKEN from './token'
import { HOST } from './config'

const app = express()

// Middleware to parse JSON bodies
app.use(bodyParser.json())

// The endpoint to get invoice data
app.get('/api/finance/invoices', async (req: Request, res: Response) => {
  console.log('Fetching invoice data...')

  try {
    const response = await fetch(`${HOST}/finance/invoices`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    // Log the response from the external API
    const responseData = await response.json()
    console.log('Response from external API:', responseData)

    if (!response.ok) {
      const errorData = await response.json()

      // Log the error response data
      console.error('Error data from external API:', errorData)

      // Handle error properly
      const errorMessage =
        (errorData as { message?: string }).message ??
        'Unknown error from external API'

      return res
        .status(500)
        .json({ message: `Failed to retrieve invoice data: ${errorMessage}` })
    }

    // Successfully fetched data
    console.log('Invoice data fetched successfully')
    res.status(200).json({ success: true, data: responseData })
  } catch (error: unknown) {
    console.error('Error fetching invoice data:', error)

    // Type assertion for error here
    if (error instanceof Error) {
      console.error('Detailed error message:', error.message)
      res.status(500).json({
        message: `An error occurred while fetching invoice data: ${error.message}`,
      })
    } else {
      console.error('Unknown error occurred')
      res.status(500).json({
        message: 'An unknown error occurred while fetching invoice data',
      })
    }
  }
})

export default app
