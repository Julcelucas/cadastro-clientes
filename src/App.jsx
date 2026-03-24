import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'cadastro_clientes_v1'

const PROVINCIAS_ANGOLA = [
  'Bengo',
  'Benguela',
  'Bie',
  'Cabinda',
  'Cuando Cubango',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cunene',
  'Huambo',
  'Huila',
  'Luanda',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Namibe',
  'Uige',
  'Zaire',
]

const initialFormState = {
  nome: '',
  email: '',
  telefone: '',
  nif: '',
  empresa: '',
  provincia: '',
  observacoes: '',
}

function App() {
  const [clientes, setClientes] = useState(() => {
    try {
      const dadosSalvos = localStorage.getItem(STORAGE_KEY)
      if (!dadosSalvos) {
        return []
      }

      const clientesSalvos = JSON.parse(dadosSalvos)
      return Array.isArray(clientesSalvos) ? clientesSalvos : []
    } catch {
      return []
    }
  })

  const [formData, setFormData] = useState(initialFormState)
  const [editandoId, setEditandoId] = useState(null)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes))
  }, [clientes])

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) {
      return clientes
    }

    return clientes.filter((cliente) => {
      return [
        cliente.nome,
        cliente.email,
        cliente.telefone,
        cliente.nif,
        cliente.empresa,
        cliente.provincia,
      ].some((campo) => String(campo || '').toLowerCase().includes(termo))
    })
  }, [busca, clientes])

  const estatisticas = useMemo(() => {
    const total = clientes.length
    const comTelefone = clientes.filter((cliente) => String(cliente.telefone || '').trim()).length
    const comNif = clientes.filter((cliente) => String(cliente.nif || '').trim()).length

    return {
      total,
      comTelefone,
      comNif,
    }
  }, [clientes])

  function limparFormulario() {
    setFormData(initialFormState)
    setEditandoId(null)
  }

  function atualizarCampo(evento) {
    const { name, value } = evento.target
    setFormData((estadoAtual) => ({
      ...estadoAtual,
      [name]: value,
    }))
  }

  function salvarCliente(evento) {
    evento.preventDefault()

    const nome = formData.nome.trim()
    const email = formData.email.trim()
    const telefone = formData.telefone.trim()
    const nif = formData.nif.trim()
    const empresa = formData.empresa.trim()
    const provincia = formData.provincia.trim()
    const observacoes = formData.observacoes.trim()

    if (!nome || !email) {
      return
    }

    const agora = new Date().toISOString()

    if (editandoId) {
      setClientes((estadoAtual) =>
        estadoAtual.map((cliente) => {
          if (cliente.id !== editandoId) {
            return cliente
          }

          return {
            ...cliente,
            nome,
            email,
            telefone,
            nif,
            empresa,
            provincia,
            observacoes,
            atualizadoEm: agora,
          }
        }),
      )
      limparFormulario()
      return
    }

    const novoCliente = {
      id: crypto.randomUUID(),
      nome,
      email,
      telefone,
      nif,
      empresa,
      provincia,
      observacoes,
      criadoEm: agora,
      atualizadoEm: agora,
    }

    setClientes((estadoAtual) => [novoCliente, ...estadoAtual])
    limparFormulario()
  }

  function iniciarEdicao(cliente) {
    setEditandoId(cliente.id)
    setFormData({
      nome: cliente.nome || '',
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      nif: cliente.nif || '',
      empresa: cliente.empresa || '',
      provincia: cliente.provincia || '',
      observacoes: cliente.observacoes || '',
    })
  }

  function excluirCliente(id) {
    setClientes((estadoAtual) => estadoAtual.filter((cliente) => cliente.id !== id))

    if (editandoId === id) {
      limparFormulario()
    }
  }

  function formatarData(dataIso) {
    try {
      return new Intl.DateTimeFormat('pt-AO', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(dataIso))
    } catch {
      return new Intl.DateTimeFormat('pt-PT', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(dataIso))
    }
  }

  function formatarContacto(telefone) {
    const valor = String(telefone || '').trim()
    if (!valor) {
      return '-'
    }

    if (valor.startsWith('+244')) {
      return valor
    }

    return `+244 ${valor}`
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Gestao Comercial em Angola</p>
        <h1>Cadastro de Clientes</h1>
        <p className="subtitle">
          Registe, edite e acompanhe clientes em contexto angolano, com dados guardados no navegador.
        </p>
      </header>

      <section className="dashboard-grid">
        <article className="card form-card">
          <h2>{editandoId ? 'Editar cliente' : 'Novo cliente'}</h2>

          <form onSubmit={salvarCliente}>
            <label>
              Nome completo
              <input
                name="nome"
                type="text"
                value={formData.nome}
                onChange={atualizarCampo}
                placeholder="Ex: Ana Paula Ribeiro"
                required
              />
            </label>

            <label>
              E-mail
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={atualizarCampo}
                placeholder="cliente@empresa.co.ao"
                required
              />
            </label>

            <label>
              Telefone
              <input
                name="telefone"
                type="tel"
                value={formData.telefone}
                onChange={atualizarCampo}
                placeholder="923 000 000"
              />
            </label>

            <label>
              NIF
              <input
                name="nif"
                type="text"
                value={formData.nif}
                onChange={atualizarCampo}
                placeholder="5000000000"
              />
            </label>

            <label>
              Empresa
              <input
                name="empresa"
                type="text"
                value={formData.empresa}
                onChange={atualizarCampo}
                placeholder="Nome da empresa"
              />
            </label>

            <label>
              Provincia
              <select name="provincia" value={formData.provincia} onChange={atualizarCampo}>
                <option value="">Selecione a provincia</option>
                {PROVINCIAS_ANGOLA.map((provincia) => (
                  <option key={provincia} value={provincia}>
                    {provincia}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Observacoes
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={atualizarCampo}
                placeholder="Anote detalhes importantes"
                rows={3}
              />
            </label>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                {editandoId ? 'Salvar alteracoes' : 'Cadastrar cliente'}
              </button>

              {editandoId && (
                <button className="btn btn-ghost" type="button" onClick={limparFormulario}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </article>

        <article className="card metrics-card">
          <h2>Resumo rapido</h2>

          <div className="metrics-list">
            <div>
              <span>Total</span>
              <strong>{estatisticas.total}</strong>
            </div>
            <div>
              <span>Com telefone</span>
              <strong>{estatisticas.comTelefone}</strong>
            </div>
            <div>
              <span>Com NIF</span>
              <strong>{estatisticas.comNif}</strong>
            </div>
          </div>

          <label className="search-wrap">
            Buscar cliente
            <input
              type="search"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Busque por nome, NIF, provincia, telefone..."
            />
          </label>
        </article>
      </section>

      <section className="card list-card">
        <h2>Lista de clientes</h2>

        {clientesFiltrados.length === 0 ? (
          <p className="empty-state">
            {clientes.length === 0
              ? 'Nenhum cliente cadastrado ainda.'
              : 'Nenhum cliente encontrado para a busca atual.'}
          </p>
        ) : (
          <div className="clientes-grid">
            {clientesFiltrados.map((cliente, index) => (
              <article
                key={cliente.id}
                className="cliente-item"
                style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
              >
                <div>
                  <h3>{cliente.nome}</h3>
                  <p>{cliente.email}</p>
                </div>

                <dl>
                  <div>
                    <dt>Telefone</dt>
                    <dd>{formatarContacto(cliente.telefone)}</dd>
                  </div>
                  <div>
                    <dt>NIF</dt>
                    <dd>{cliente.nif || '-'}</dd>
                  </div>
                  <div>
                    <dt>Provincia</dt>
                    <dd>{cliente.provincia || '-'}</dd>
                  </div>
                  <div>
                    <dt>Empresa</dt>
                    <dd>{cliente.empresa || '-'}</dd>
                  </div>
                  <div>
                    <dt>Atualizado</dt>
                    <dd>{formatarData(cliente.atualizadoEm)}</dd>
                  </div>
                </dl>

                {cliente.observacoes && <p className="obs">{cliente.observacoes}</p>}

                <div className="item-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => iniciarEdicao(cliente)}>
                    Editar
                  </button>
                  <button className="btn btn-danger" type="button" onClick={() => excluirCliente(cliente.id)}>
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
