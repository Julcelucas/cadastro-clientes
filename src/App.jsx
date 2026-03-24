import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'cadastro-clientes:v1'

const INITIAL_FORM = {
  nome: '',
  email: '',
  telefone: '',
  cidade: '',
}

function formatDate(dateIso) {
  return new Date(dateIso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function App() {
  const [clientes, setClientes] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  })
  const [form, setForm] = useState(INITIAL_FORM)
  const [termoBusca, setTermoBusca] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes))
  }, [clientes])

  const clientesFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase()
    if (!termo) return clientes

    return clientes.filter((cliente) =>
      [cliente.nome, cliente.email, cliente.telefone, cliente.cidade]
        .join(' ')
        .toLowerCase()
        .includes(termo),
    )
  }, [clientes, termoBusca])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function limparFormulario() {
    setForm(INITIAL_FORM)
    setEditingId(null)
    setErro('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    setErro('')

    const nome = form.nome.trim()
    const email = form.email.trim().toLowerCase()
    const telefone = form.telefone.trim()
    const cidade = form.cidade.trim()

    if (!nome || !email || !telefone || !cidade) {
      setErro('Preencha todos os campos para salvar o cliente.')
      return
    }

    const emailJaExiste = clientes.some(
      (cliente) => cliente.email === email && cliente.id !== editingId,
    )

    if (emailJaExiste) {
      setErro('Ja existe um cliente cadastrado com este e-mail.')
      return
    }

    if (editingId) {
      setClientes((current) =>
        current.map((cliente) =>
          cliente.id === editingId
            ? {
                ...cliente,
                nome,
                email,
                telefone,
                cidade,
                atualizadoEm: new Date().toISOString(),
              }
            : cliente,
        ),
      )
      limparFormulario()
      return
    }

    setClientes((current) => [
      {
        id: crypto.randomUUID(),
        nome,
        email,
        telefone,
        cidade,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      },
      ...current,
    ])
    limparFormulario()
  }

  function handleEditar(cliente) {
    setForm({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      cidade: cliente.cidade,
    })
    setEditingId(cliente.id)
    setErro('')
  }

  function handleExcluir(id) {
    setClientes((current) => current.filter((cliente) => cliente.id !== id))

    if (id === editingId) {
      limparFormulario()
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="kicker">Gestao de relacionamento</p>
        <h1>Cadastro de Clientes</h1>
        <p>
          Organize seus contatos com uma agenda rapida, persistente e pronta
          para uso diario.
        </p>
      </header>

      <section className="panel form-panel">
        <h2>{editingId ? 'Editar cliente' : 'Novo cliente'}</h2>

        <form onSubmit={handleSubmit} className="cliente-form">
          <label>
            Nome
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Maria Silva"
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="maria@email.com"
            />
          </label>

          <label>
            Telefone
            <input
              type="tel"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
            />
          </label>

          <label>
            Cidade
            <input
              type="text"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              placeholder="Sao Paulo"
            />
          </label>

          {erro ? <p className="feedback error">{erro}</p> : null}

          <div className="actions">
            <button type="submit" className="btn primary">
              {editingId ? 'Salvar alteracoes' : 'Cadastrar cliente'}
            </button>
            <button type="button" className="btn ghost" onClick={limparFormulario}>
              Limpar
            </button>
          </div>
        </form>
      </section>

      <section className="panel list-panel">
        <div className="list-header">
          <h2>Clientes cadastrados</h2>
          <input
            type="search"
            value={termoBusca}
            onChange={(event) => setTermoBusca(event.target.value)}
            placeholder="Buscar por nome, e-mail, telefone..."
          />
        </div>

        {clientesFiltrados.length === 0 ? (
          <p className="empty-state">Nenhum cliente encontrado com esse filtro.</p>
        ) : (
          <ul className="cliente-list">
            {clientesFiltrados.map((cliente) => (
              <li key={cliente.id} className="cliente-card">
                <div>
                  <h3>{cliente.nome}</h3>
                  <p>{cliente.email}</p>
                  <p>{cliente.telefone}</p>
                  <p>{cliente.cidade}</p>
                  <small>Atualizado em {formatDate(cliente.atualizadoEm)}</small>
                </div>

                <div className="card-actions">
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => handleEditar(cliente)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn small danger"
                    onClick={() => handleExcluir(cliente.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
