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

    // Função para formatar os valores antes de enviar
    const handleSave = () => {
        const updatedTaxa: TaxaEntrega = {
            ...taxa,
            distanciaMin: parseFloat(distanciaMin), // Convertendo para número
            distanciaMax: parseFloat(distanciaMax), // Convertendo para número
            valor: parseFloat(valor.replace('R$', '').trim()).toString(), // Remover o 'R$' e converter para número
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
                            <input
                                type="number"
                                id="distanciaMin"
                                value={distanciaMin}
                                onChange={(e) => setDistanciaMin(e.target.value)}
                                placeholder="Ex: 10" // Sugestão de valor
                            />
                            <span className={styles.suffix}>Km</span>
                            <span className={styles.suffix}>Km</span>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="distanciaMax">Distância Máxima</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="number"
                                id="distanciaMax"
                                value={distanciaMax}
                                onChange={(e) => setDistanciaMax(e.target.value)}
                                placeholder="Ex: 50" // Sugestão de valor
                            />
                            <span className={styles.suffix}>Km</span>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="valor">Valor</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                id="valor"
                                value={`R$ ${valor}`}
                                onChange={(e) => setValor(e.target.value.replace('R$', '').trim())} // Remover 'R$' antes de salvar
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
