import React from 'react';

const Navbar = () => {
    return (
        <nav className="navbar navbar-light navbar-expand-md navigation-clean-button">
            <div className="container"><a className="navbar-brand" href="#">Hívők</a><button data-toggle="collapse" data-target="#navcol-2" className="navbar-toggler"><span className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                <div className="collapse navbar-collapse" id="navcol-2">
                    <ul className="nav navbar-nav mr-auto">
                        <li className="nav-item"><a className="nav-link active" href="/">Home</a></li>
                        <li className="nav-item"><a className="nav-link " href="/profile">Profile</a></li>

                        <li className="nav-item"><a className="nav-link" href="/teams">Teams</a></li>
                    </ul>

                    {/*!session && (
                        <>

                            <span className="navbar-text actions"><a className="btn btn-light action-button" role="button" href="/api/auth/signin" style={{margin: '0px', marginRight: '10px'}}>Log in</a></span>
                            <span className="d-none d-lg-inline mr-2 text-gray-600 small">Welcome, Guest</span>
                        </>
                    )*/}
                    {
                        /*  */
                        /*
                        session && (
                            <>
                                <span className="navbar-text actions"><a className="btn btn-light action-button" role="button" href="/api/auth/signout" style={{margin: '0px', marginRight: '10px'}}>Log Out</a></span>

                                <p style={{ marginBottom: '0px' , paddingRight: '10px' }}>  {session.user.name ?? session.user.email}</p>
                                <img className="border rounded-circle img-profile" width="60" height="60" src={session.user.image} />

                            </>
                        )*/
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar;