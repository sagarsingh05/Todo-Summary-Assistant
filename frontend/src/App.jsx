import { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

function Modal({ title, message, onClose, isEdit, editInput, setEditInput, onSave }) {
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <div style={modalStyles.header}>
          <h2 style={{ margin: 0, color: 'white' }}>{title}</h2>
          <button onClick={onClose} style={modalStyles.closeButton} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div style={modalStyles.body}>
          {isEdit ? (
            <>
              <input
                type="text"
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                style={{...styles.input,  marginLeft: '15px', backgroundColor: '#fff', }}
              />
              <button onClick={onSave} style={{ ...styles.addButton, marginTop: '1rem', marginBottom: '15px', marginLeft: '80px' }}>
                Save
              </button>
            </>
          ) : (
            <p>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}


function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editTodo, setEditTodo] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (message) {
      setShowModal(true);
    }
  }, [message]);

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(`${API}/todos`);
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  const addTodo = async () => {
    if (!input.trim()) return;

    try {
      await axios.post(`${API}/todos`, { title: input });
      setInput('');
      fetchTodos();
    } catch (err) {
      console.error("Add failed:", err);
      setMessage("Couldn't add todo.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const summarize = async () => {
    try {
      const res = await axios.post(`${API}/summarize`);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Couldn't summarize.");
    }
  };

  const openEditModal = (todo) => {
  setEditTodo(todo);
  setEditInput(todo.title);
  setShowModal(true);
};

const updateTodo = async () => {
  try {
    await axios.put(`${API}/todos/${editTodo.id}`, { title: editInput });
    setEditTodo(null);
    setEditInput('');
    setShowModal(false);
    fetchTodos();
  } catch (err) {
    console.error("Update failed:", err);
    setMessage("Couldn't update todo.");
  }
};

const closeModal = () => {
  setShowModal(false);
  setMessage('');
  setEditTodo(null);
  setEditInput('');
};


  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Todo Summary Assistant</h1>

        <div style={styles.inputGroup}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            style={styles.input}
          />
          <button onClick={addTodo} style={styles.addButton}>
            Add
          </button>
        </div>

<ul style={styles.todoList}>
  {todos.map((todo) => (
    <li key={todo.id} style={styles.todoItem}>
      <span>{todo.title}</span>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => openEditModal(todo)} style={styles.editButton}>
          ✎
        </button>
        <button onClick={() => deleteTodo(todo.id)} style={styles.deleteButton}>
          ✕
        </button>
      </div>
    </li>
  ))}
</ul>


        <button onClick={summarize} style={styles.summarizeButton}>
          Summarize
        </button>


{showModal && (
  <Modal
    title={editTodo ? "Edit Todo" : "Status"}
    message={message}
    onClose={closeModal}
    isEdit={!!editTodo}
    editInput={editInput}
    setEditInput={setEditInput}
    onSave={updateTodo}
  />
)}

      </div>
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    
  },
  header: {
    backgroundColor: '#3730a3',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: '1.5rem',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  body: {
    color: '#78350f', 
    fontWeight: '600',
    fontSize: '1.1rem',
    margin : '0px'
  },
};

const styles = {
  wrapper: {
    backgroundColor: '#cbd5e1',
    height: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0px'
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    background: '#e2e8f0',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#1e293b',
  },
  inputGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  input: {
    flex: '1',
    padding: '0.65rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #94a3b8', 
    backgroundColor: '#cbd5e1',
  },
  addButton: {
    padding: '0.65rem 1.25rem',
    backgroundColor: '#3730a3', 
    color: 'white',
    fontWeight: '500',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  todoList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '1.5rem',
  },
  todoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    borderBottom: '1px solid #94a3b8',
    backgroundColor: '#f1f5f9',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  deleteButton: {
    color: '#b91c1c', 
    fontWeight: 'bold',
    border: 'none',
    background: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  summarizeButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#3730a3',
    color: 'white',
    fontWeight: '500',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },

  editButton: {
  color: '#1e40af',
  fontWeight: 'bold',
  border: 'none',
  background: 'none',
  fontSize: '1rem',
  cursor: 'pointer',
}

};

export default App;
