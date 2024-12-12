import { useState, FormEvent, useContext, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from '../signup/style.module.scss';
import logoImg from '../../../public/logo.png';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import DatePicker from "react-datepicker";

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [genero, setGenero] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [cpf, setCpf] = useState('');
  const [tipo, setTipo] = useState('');
  const [senha, setSenha] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [telefoneCelular, setTelefoneCelular] = useState('');
  const [telefoneResidencial, setTelefoneResidencial] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchAddressByCep(cep: string) {
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`/api/cep?cep=${cep}`);
      const data = await response.json();

      if (data.error) {
        toast.error("CEP não encontrado");
        return;
      }

      setLogradouro(data.logradouro || '');
      setBairro(data.bairro || '');
      setCidade(data.localidade || '');
      setUf(data.uf || '');
      setComplemento(data.complemento || '');
    } catch (error) {
      toast.error("Erro ao buscar informações do CEP");
    }
  }

  useEffect(() => {
    if (cep) {
      fetchAddressByCep(cep.replace(/\D/g, '')); // Remove caracteres não numéricos
    }
  }, [cep]);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    if (!nome || !email || !senha || !cpf || !dataNasc || !cep || !tipo || !logradouro || !numero || !bairro || !cidade || !uf || !telefoneResidencial || !telefoneCelular) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    const data = {
      nome,
      email,
      genero,
      dataNasc,
      cpf,
      tipo,
      senha,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      telefoneResidencial,
      telefoneCelular,
    };

    await signUp(data);
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Faça seu cadastro agora!</title>
      </Head>
      <div className={styles.containerCenter}>
        <div className={styles.login}>
          {/* <Image src={logoImg} alt="Logo Pizzaria "/> */}
          <a href="/">
            <Image src={logoImg} alt="Logo Pizzaria" />
          </a>
          <h1 className={styles.title}>Criando sua conta</h1>

          <form onSubmit={handleSignUp} className={styles.form}>

            {/* Inputs de clicar/selecionar */}
            <div className={styles.sectionInputs}>
              <div className={styles.sectionInputsRow}>
                <select value={genero} onChange={(e) => setGenero(e.target.value)} className={styles.select}>
                  <option value="">Gênero</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </select>

                <DatePicker
                  id="dataNasc"
                  selected={dataNasc ? new Date(dataNasc) : null}
                  onChange={(date) => setDataNasc(date ? date.toISOString().split('T')[0] : '')}
                  placeholderText="Data de Nascimento"
                  className={styles.datePicker}
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              <div className={styles.sectionInputsRow}>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={styles.select}>
                  <option value="">Tipo de cadastro</option>
                  <option value="cliente">Cliente</option>
                  <option value="funcionario">Funcionário</option>
                </select>

                <Input placeholder="CEP" type="text" value={cep} onChange={(e) => setCep(e.target.value)} />
              </div>
            </div>

            {/* Inputs de texto */}
            <div className={styles.sectionInputs}>
              <Input placeholder="Digite seu nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
              <Input placeholder="Digite seu email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Digite seu CPF" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />
              <Input placeholder="Digite sua senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
              <Input placeholder="Logradouro" type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />
              <Input placeholder="Número" type="text" value={numero} onChange={(e) => setNumero(e.target.value)} />
              <Input placeholder="Complemento" type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
              <Input placeholder="Bairro" type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} />
              <Input placeholder="Cidade" type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} />
              <Input placeholder="UF" type="text" value={uf} onChange={(e) => setUf(e.target.value)} />
              <Input placeholder="Telefone Residencial" type="text" value={telefoneResidencial} onChange={(e) => setTelefoneResidencial(e.target.value)} />
              <Input placeholder="Telefone Celular" type="text" value={telefoneCelular} onChange={(e) => setTelefoneCelular(e.target.value)} />
            </div>

            <Button type="submit" loading={loading} className={styles.button}>
              Cadastrar
            </Button>

            <Link href="/" legacyBehavior>
              <a className={styles.text}>Já possui uma conta? Faça o login</a>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

