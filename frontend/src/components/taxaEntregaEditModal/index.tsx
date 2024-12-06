import { useState } from 'react';
import styles from './styles.module.scss';

interface TaxaEntrega {
    id: number;
    distanciaMin: number;
    distanciaMax: number;
    valor: string;
}

interface TaxaEntregaEditModalProps {
    taxa: TaxaEntrega;
    onClose: () => void;
    onSave: (taxa: TaxaEntrega) => void;
}

export const TaxaEntregaEditModal: React.FC<TaxaEntregaEditModalProps> = ({ taxa, onClose, onSave }) => {
    const [distanciaMin, setDistanciaMin] = useState(taxa.distanciaMin.toString());
    const [distanciaMax, setDistanciaMax] = useState(taxa.distanciaMax.toString());
    const [valor, setValor] = useState(taxa.valor);

    // Função para formatar o valor do preço
    const formatPrice = (value: string): string => {
        if (!value.trim()) return 'R$ 0,00'; // Retorna vazio caso o valor esteja vazio ou apenas espaços

        // Remove qualquer coisa que não seja número
        const cleanValue = value.replace(/\D/g, '');
        // Converte para número e ajusta a vírgula
        const numericValue = (parseInt(cleanValue, 10) / 100).toFixed(2);
        return `R$ ${numericValue.replace('.', ',')}`;
    };

    // Função para preparar o preço para envio
    const parsePriceForSubmission = (price: string): string => {
        return price.replace(/[^\d,]/g, '').replace(',', '.').replace('R$', '').trim();
    };

    // Função para lidar com a alteração do valor
    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;

        // Remove o 'R$' para manipulação interna
        rawValue = rawValue.replace('R$', '').trim();

        // Apenas números e vírgulas são permitidos
        const filteredValue = rawValue.replace(/[^\d,]/g, '');

        // Armazena o valor sem a formatação
        setValor(filteredValue);

        // Formata o valor com a vírgula
        const formattedValue = formatPrice(filteredValue);
        e.target.value = formattedValue; // Atualiza o valor exibido no input
    };

    // Função para salvar os dados formatados
    const handleSave = () => {
        const updatedTaxa: TaxaEntrega = {
            ...taxa,
            distanciaMin: parseFloat(distanciaMin), // Convertendo para número
            distanciaMax: parseFloat(distanciaMax), // Convertendo para número
            valor: parsePriceForSubmission(valor), // Converte o valor para o formato correto antes de salvar
        };

        onSave(updatedTaxa); // Chama a função onSave passando a taxa atualizada.
        onClose(); // Fecha o modal após salvar.
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Editar Taxa de Entrega</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="distanciaMin">Distância Mínima</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.prefix}>Km</span>
                            <input
                                type="number"
                                id="distanciaMin"
                                value={distanciaMin}
                                onChange={(e) => setDistanciaMin(e.target.value)}
                                placeholder="10" // Sugestão de valor
                            />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="distanciaMax">Distância Máxima</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.prefix}>Km</span>
                            <input
                                type="number"
                                id="distanciaMax"
                                value={distanciaMax}
                                onChange={(e) => setDistanciaMax(e.target.value)}
                                placeholder="50" // Sugestão de valor
                            />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="valor">Valor</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                id="valor"
                                value={valor ? formatPrice(valor) : 'R$ 0,00'} // Exibe o valor formatado
                                onChange={handleValorChange} // Atualiza o valor ao digitar
                                placeholder="Ex: 25,00" // Sugestão de valor
                            />
                            <span className={styles.suffix}></span>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.buttonSave} onClick={handleSave}>
                        Salvar
                    </button>
                    <button className={styles.buttonCancel} onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
