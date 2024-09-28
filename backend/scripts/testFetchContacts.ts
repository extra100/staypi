import { fetchContacts } from '../src/services/contactsService'

async function testFetchContacts() {
  try {
    const contacts = await fetchContacts()
    console.log('Test Contacts Data:', JSON.stringify(contacts, null, 2))
  } catch (error) {
    console.error('Error during test:', error)
  }
}
testFetchContacts()
