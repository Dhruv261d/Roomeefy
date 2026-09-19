import { Box } from 'lucide-react';
import React from 'react'
import Button from './ui/Button';
import { NavLink } from 'react-router';
import { SignInButton, UserButton, useAuth } from '@clerk/react';

const Navbar = () => {
    const { userId } = useAuth();

  return (
    <header className='navbar'>
        <nav className='inner'>
            <div className='left'>
                <div className='brand'>
                    <Box className='logo' />
                    <span className='name'>
                        Roomeefy
                    </span>
                </div>

                <ul className='links'>
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Product</NavLink>
                    <NavLink to="/pricing" className={({ isActive }) => isActive ? 'active' : ''}>Pricing</NavLink>
                    <NavLink to="/community" className={({ isActive }) => isActive ? 'active' : ''}>Community</NavLink>
                </ul>
            </div>

            <div className='actions'>
                {userId ? (
                    <UserButton />
                ) : (
                    <div className="auth-group">
                        <SignInButton mode="modal">
                            <Button size='sm' variant='ghost'>
                                Log In
                            </Button>
                        </SignInButton>
                        <a href="/#upload" className='cta'>Get Started</a>
                    </div>
                )}
            </div>
        </nav>
    </header>
  )
}

export default Navbar
