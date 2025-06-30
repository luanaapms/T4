import React, { useState, ChangeEvent, FormEvent } from "react";
import { Cliente, Endereco, Telefone } from '../models/types';
import { apiClientes } from '../services/api';

type Props = {
  tema?: string;
  onAdicionarCliente: (cliente: Cliente) => void;
};

const FormularioCadastroCliente: React.FC<Props> = ({ tema, onAdicionarCliente }) => {
  const [nome, setNome] = useState<string>('');
  const [sobreNome, setSobreNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [endereco, setEndereco] = useState<Endereco>({
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    codigoPostal: '',
    informacoesAdicionais: ''
  });
  const [telefones, setTelefones] = useState<Telefone[]>([{ ddd: '', numero: '' }]);
  const [mensagem, setMensagem] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch(name) {
      case 'nome': setNome(value); break;
      case 'sobreNome': setSobreNome(value); break;
      case 'email': setEmail(value); break;
      case 'estado': setEndereco(prev => ({ ...prev, estado: value })); break;
      case 'cidade': setEndereco(prev => ({ ...prev, cidade: value })); break;
      case 'bairro': setEndereco(prev => ({ ...prev, bairro: value })); break;
      case 'rua': setEndereco(prev => ({ ...prev, rua: value })); break;
      case 'numero': setEndereco(prev => ({ ...prev, numero: value })); break;
      case 'codigoPostal': setEndereco(prev => ({ ...prev, codigoPostal: value })); break;
      case 'informacoesAdicionais': setEndereco(prev => ({ ...prev, informacoesAdicionais: value })); break;
    }
  };

  const handleTelefoneChange = (index: number, field: keyof Telefone, value: string) => {
    const novosTelefones = [...telefones];
    novosTelefones[index] = { ...novosTelefones[index], [field]: value };
    setTelefones(novosTelefones);
  };

  const adicionarTelefone = () => setTelefones([...telefones, { ddd: '', numero: '' }]);
  const removerTelefone = (index: number) => setTelefones(telefones.filter((_, i) => i !== index));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nome || !sobreNome || telefones.length === 0 || telefones.some(t => !t.ddd || !t.numero)) {
      setMensagem('Por favor, preencha os campos obrigatórios: Nome, Sobrenome, CPF e ao menos um telefone completo.');
      return;
    }

    const novoCliente: Omit<Cliente, 'id'> = {
      nome,
      sobreNome,
      email: email || null,
      endereco,
      telefones,
    };

    try {
      const clienteCadastrado = await apiClientes.cadastrar(novoCliente);
      onAdicionarCliente(clienteCadastrado);
      setMensagem('Cliente cadastrado com sucesso!');
      setNome('');
      setSobreNome('');
      setEmail('');
      setEndereco({
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        numero: '',
        codigoPostal: '',
        informacoesAdicionais: ''
      });
      setTelefones([{ ddd: '', numero: '' }]);
    } catch (error: any) {
      setMensagem('Erro ao cadastrar cliente: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const estiloBotao = `btn waves-effect waves-light ${tema || ''}`;

  return (
    <div className="container" style={{ paddingTop: '40px', maxWidth: 700 }}>
      <div className="card">
        <div className="card-content">
          <form className="row" onSubmit={handleSubmit}>
            <h5 className="card-title">Cadastro de Cliente</h5>

            <div className="input-field col s12 m6">
              <input name="nome" type="text" value={nome} onChange={handleChange} required />
              <label className={nome ? "active" : undefined}>Nome</label>
            </div>
            <div className="input-field col s12 m6">
              <input name="sobreNome" type="text" value={sobreNome} onChange={handleChange} required />
              <label className={sobreNome ? "active" : undefined}>Sobrenome</label>
            </div>

            <div className="input-field col s12 m6">
              <input name="email" type="email" value={email} onChange={handleChange} />
              <label className={email ? "active" : undefined}>Email</label>
            </div>
            <div className="input-field col s4">
              <input name="estado" type="text" value={endereco.estado} onChange={handleChange} required />
              <label className={endereco.estado ? "active" : undefined}>Estado</label>
            </div>
            <div className="input-field col s4">
              <input name="cidade" type="text" value={endereco.cidade} onChange={handleChange} required />
              <label className={endereco.cidade ? "active" : undefined}>Cidade</label>
            </div>
            <div className="input-field col s4">
              <input name="bairro" type="text" value={endereco.bairro} onChange={handleChange} required />
              <label className={endereco.bairro ? "active" : undefined}>Bairro</label>
            </div>

            <div className="input-field col s6">
              <input name="rua" type="text" value={endereco.rua} onChange={handleChange} required />
              <label className={endereco.rua ? "active" : undefined}>Rua</label>
            </div>
            <div className="input-field col s3">
              <input name="numero" type="text" value={endereco.numero} onChange={handleChange} required />
              <label className={endereco.numero ? "active" : undefined}>Número</label>
            </div>
            <div className="input-field col s3">
              <input name="codigoPostal" type="text" value={endereco.codigoPostal} onChange={handleChange} />
              <label className={endereco.codigoPostal ? "active" : undefined}>Código Postal</label>
            </div>

            <div className="input-field col s12">
              <input name="informacoesAdicionais" type="text" value={endereco.informacoesAdicionais ?? ''} onChange={handleChange} />
              <label className={endereco.informacoesAdicionais ? "active" : undefined}>Informações Adicionais</label>
            </div>
            {telefones.map((tel, i) => (
              <div key={i} className="row" style={{ marginBottom: '0' }}>
                <div className="input-field col s2">
                  <input
                    type="text"
                    value={tel.ddd}
                    onChange={(e) => handleTelefoneChange(i, 'ddd', e.target.value)}
                    required
                  />
                  <label className={tel.ddd ? 'active' : ''}>DDD</label>
                </div>
                <div className="input-field col s8">
                  <input
                    type="text"
                    value={tel.numero}
                    onChange={(e) => handleTelefoneChange(i, 'numero', e.target.value)}
                    required
                  />
                  <label className={tel.numero ? 'active' : ''}>Número</label>
                </div>
                <div className="input-field col s2" style={{ paddingTop: '10px' }}>
                  <button type="button" className="btn red" onClick={() => removerTelefone(i)}>Remover</button>
                </div>
              </div>
            ))}
            <button type="button" className="btn green" onClick={adicionarTelefone} style={{ marginBottom: '1rem' }}>
              Adicionar
            </button>

            <div className="col s12" style={{ marginTop: 30 }}>
              <button className={estiloBotao} type="submit">Cadastrar</button>
            </div>

            {mensagem && (
              <div className="col s12" style={{ marginTop: 20 }}>
                <span className={mensagem.includes('Erro') ? 'red-text' : 'green-text'}>{mensagem}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioCadastroCliente;
