import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { supabase } from '../../lib/supabase'

export default function HomeScreen() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const createTask = async () => {
    setMessage('')

    if (!title.trim()) {
      setMessage('Enter a task title.')
      return
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: title.trim(),
          status: 'open',
        },
      ])
      .select()

    console.log('INSERT DATA:', data)
    console.log('INSERT ERROR:', error)

    if (error) {
      setMessage(`Error: ${error.message}`)
      return
    }

    setMessage('Task posted successfully.')
    setTitle('')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Post a Task</Text>
      <Text style={styles.subtext}>Describe the job you need help with.</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Example: Help move a couch"
        placeholderTextColor="#888"
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={createTask}>
        <Text style={styles.buttonText}>Post Task</Text>
      </Pressable>

      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    marginTop: 16,
    fontSize: 15,
    color: '#111',
  },
})