import { useContext } from 'react';
import styles from '../Header/style.module.scss';
import Link from 'next/link';

import { FiLogOut } from 'react-icons/fi';

import { AuthContext } from '../../contexts/AuthContext';

export function Header(){
    const { signOut} = useContext(AuthContext)
    // const { user} = useContext(AuthContext)
    
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link legacyBehavior href='/dashboard'>
                    <img src='/logo.png' width={210} height={80}/>
                </Link>

                {/* <h2> Bem vindo(a) {user?.name}! </h2> */}

                <nav className={styles.menuNav}>

                <Link legacyBehavior href='/dashboard'>
                        <a>Dashboard</a>
                    </Link>
                    <Link legacyBehavior href='/category'>
                        <a>Categoria</a>
                    </Link>

                    <Link legacyBehavior href='/product'>
                        <a>Cardápio</a>
                    </Link>

                    <Link legacyBehavior href='/listUsers'>
                        <a>Usuários</a>
                    </Link>

                    <Link legacyBehavior href='/taxaEntrega'>
                        <a>Taxa de Entrega</a>
                    </Link>

                    <button onClick={signOut}>
                        <FiLogOut color='#413F46' size={24}/>
                    </button>

                </nav>
            </div>
        </header>
    )
}