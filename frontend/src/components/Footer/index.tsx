import styles from './home.module.scss'; // Certifique-se de que o caminho esteja correto
import Link from 'next/link';
import imgSsaborEArt from '../../../public/logoFooter.png'
import imgTwitter from '../../../public/logo-twitter.png'
import imgWhatsapp from '../../../public/logo-whatsapp.png'
import imgInstagram from '../../../public/logo-instagram.png'
import imgTiktok from '../../../public/logo-tiktok.png'
import Image from "next/image";

export function Footer() {
    return (
        <div className={styles.footerContainer}>
            <div className={styles.footerContent}>
                <div className={styles.footerColun}>
                    <nav className={styles.footerNav}>
                        <Link href='/privacy'>Política de Privacidade</Link>
                        <Link href='/contact'>Contato</Link>
                    </nav>

                    <div className={styles.imgSenai}>
                        <a href="/">
                            <Image src={imgSsaborEArt} alt="Logo Pizzaria" width={300} height={170} />
                        </a>
                    </div>
                </div>

                <div className={styles.footerColun}>
                    <div className={styles.socialContainer}>
                        <p>Conheça a Sabor&Art em outras redes sociais</p>
                        <div className={styles.socialIcons}>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <Image src={imgInstagram} alt="Instagram" width={50} height={50} className={styles.imgInstagram} />
                            </a>
                            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                                <Image src={imgTiktok} alt="TikTok" width={50} height={50} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <Image src={imgTwitter} alt="Twitter" width={50} height={50} />
                            </a>
                            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
                                <Image src={imgWhatsapp} alt="WhatsApp" width={50} height={50} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.rights}>
                <p>&copy; 2024 Sabor&Art. Todos os direitos reservados.</p>
            </div>
        </div>

    );
}
