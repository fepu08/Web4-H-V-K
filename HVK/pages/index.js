import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from 'next-auth/client';



export default function index() {
  const[session,loading]=useSession();
  return ( 
       
<div>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
        <title>Dashboard - Hívők</title>
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" />
        <link rel="stylesheet" href="assets/fonts/fontawesome-all.min.css" />
        <link rel="stylesheet" href="assets/fonts/font-awesome.min.css" />
        <link rel="stylesheet" href="assets/fonts/fontawesome5-overrides.min.css" />
        <link rel="stylesheet" href="assets/css/Navigation-with-Button.css" />
        <div id="wrapper">

          <div className="d-flex flex-column" id="content-wrapper">




            <div id="content">

              
                 <nav className="navbar navbar-light navbar-expand-md navigation-clean-button">



                                    <div className="container"><a className="navbar-brand" href="#">Hívők</a><button data-toggle="collapse" data-target="#navcol-2" className="navbar-toggler"><span className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                                      <div className="collapse navbar-collapse" id="navcol-2">
                                        <ul className="nav navbar-nav mr-auto">
                                          <li className="nav-item"><a className="nav-link active" href="/">Home</a></li>
                                          <li className="nav-item"><a className="nav-link " href="/profile">Profile</a></li>
                                          
                                          <li className="nav-item"><a className="nav-link" href="/teams">Teams</a></li>
                                        </ul>
                                        
                                        {!session && (
                              <>

                    <span className="navbar-text actions"><a className="btn btn-light action-button" role="button" href="/api/auth/signin" style={{margin: '0px', marginRight: '10px'}}>Log in</a></span>
                              <span className="d-none d-lg-inline mr-2 text-gray-600 small">Welcome, Guest</span>
                              </>
                            )}
                            {
                              /*  */ 
                            session && (
                              <>
                              <span className="navbar-text actions"><a className="btn btn-light action-button" role="button" href="/api/auth/signout" style={{margin: '0px', marginRight: '10px'}}>Log Out</a></span>
                              
                              <p style={{ marginBottom: '0px' , paddingRight: '10px' }}>  {session.user.name ?? session.user.email}</p>
                              <img className="border rounded-circle img-profile" width="60" height="60" src={session.user.image} />  
                                
                              </>
                              )
                            }
                            </div>
                    </div>
                 </nav>
              
              
              <div className="container-fluid">
                <div className="d-sm-flex justify-content-between align-items-center mb-4">
                  <h3 className="text-dark mb-0"style={{margin: '0px', marginTop: '10px'}}>Home Sweet Home</h3><a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#"><i className="fas fa-download fa-sm text-white-50" />&nbsp;Do some Shit</a></div>
                <div className="row">
                  <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card shadow border-left-primary py-2">
                      <div className="card-body">
                        <div className="row align-items-center no-gutters">
                          <div className="col mr-2">
                            <div className="text-uppercase text-primary font-weight-bold text-xs mb-1"><span>TExt</span></div>
                            <div className="text-dark font-weight-bold h5 mb-0"><span>TEXT</span></div>
                          </div>
                          <div className="col-auto"><i className="fas fa-calendar fa-2x text-gray-300" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card shadow border-left-success py-2">
                      <div className="card-body">
                        <div className="row align-items-center no-gutters">
                          <div className="col mr-2">
                            <div className="text-uppercase text-success font-weight-bold text-xs mb-1"><span>TExt</span></div>
                            <div className="text-dark font-weight-bold h5 mb-0"><span>TEXT</span></div>
                          </div>
                          <div className="col-auto"><i className="fas fa-dollar-sign fa-2x text-gray-300" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card shadow border-left-info py-2">
                      <div className="card-body">
                        <div className="row align-items-center no-gutters">
                          <div className="col mr-2">
                            <div className="text-uppercase text-info font-weight-bold text-xs mb-1"><span>Tasks</span></div>
                            <div className="row no-gutters align-items-center">
                              <div className="col-auto">
                                <div className="text-dark font-weight-bold h5 mb-0 mr-3"><span>50%</span></div>
                              </div>
                              <div className="col">
                                <div className="progress progress-sm">
                                  <div className="progress-bar bg-info" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{width: '50%'}}><span className="sr-only">50%</span></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-auto"><i className="fas fa-clipboard-list fa-2x text-gray-300" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-3 mb-4">
                    <div className="card shadow border-left-warning py-2">
                      <div className="card-body">
                        <div className="row align-items-center no-gutters">
                          <div className="col mr-2">
                            <div className="text-uppercase text-warning font-weight-bold text-xs mb-1"><span>messages</span></div>
                            <div className="text-dark font-weight-bold h5 mb-0"><span>18</span></div>
                          </div>
                          <div className="col-auto"><i className="fas fa-comments fa-2x text-gray-300" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-7 col-xl-8">
                    <div className="card shadow mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="text-primary font-weight-bold m-0">TEXT</h6>
                        <div className="dropdown no-arrow"><button className="btn btn-link btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button"><i className="fas fa-ellipsis-v text-gray-400" /></button>
                          <div className="dropdown-menu shadow dropdown-menu-right animated--fade-in">
                            <p className="text-center dropdown-header">dropdown header:</p><a className="dropdown-item" href="#">&nbsp;Action</a><a className="dropdown-item" href="#">&nbsp;Another action</a>
                            <div className="dropdown-divider" /><a className="dropdown-item" href="#">&nbsp;Something else here</a></div>
                        </div>
                      </div>
                      <div className="card-body" />
                    </div>
                  </div>
                  <div className="col-lg-5 col-xl-4">
                    <div className="card shadow mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="text-primary font-weight-bold m-0">TEXT</h6>
                        <div className="dropdown no-arrow"><button className="btn btn-link btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button"><i className="fas fa-ellipsis-v text-gray-400" /></button>
                          <div className="dropdown-menu shadow dropdown-menu-right animated--fade-in">
                            <p className="text-center dropdown-header">dropdown header:</p><a className="dropdown-item" href="#">&nbsp;Action</a><a className="dropdown-item" href="#">&nbsp;Another action</a>
                            <div className="dropdown-divider" /><a className="dropdown-item" href="#">&nbsp;Something else here</a></div>
                        </div>
                      </div>
                      <div className="card-body" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <div className="card shadow mb-4">
                      <div className="card-header py-3">
                        <h6 className="text-primary font-weight-bold m-0">TEXT</h6>
                      </div>
                      <div className="card-body" />
                    </div>
                    <div className="card shadow mb-4">
                      <div className="card-header py-3">
                        <h6 className="text-primary font-weight-bold m-0">Todo List</h6>
                      </div>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          <div className="row align-items-center no-gutters">
                            <div className="col mr-2">
                              <h6 className="mb-0"><strong>Lunch meeting</strong></h6><span className="text-xs">10:30 AM</span></div>
                            <div className="col-auto">
                              <div className="custom-control custom-checkbox"><input className="custom-control-input" type="checkbox" id="formCheck-1" /><label className="custom-control-label" htmlFor="formCheck-1" /></div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item">
                          <div className="row align-items-center no-gutters">
                            <div className="col mr-2">
                              <h6 className="mb-0"><strong>Lunch meeting</strong></h6><span className="text-xs">11:30 AM</span></div>
                            <div className="col-auto">
                              <div className="custom-control custom-checkbox"><input className="custom-control-input" type="checkbox" id="formCheck-2" /><label className="custom-control-label" htmlFor="formCheck-2" /></div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item">
                          <div className="row align-items-center no-gutters">
                            <div className="col mr-2">
                              <h6 className="mb-0"><strong>Lunch meeting</strong></h6><span className="text-xs">12:30 AM</span></div>
                            <div className="col-auto">
                              <div className="custom-control custom-checkbox"><input className="custom-control-input" type="checkbox" id="formCheck-3" /><label className="custom-control-label" htmlFor="formCheck-3" /></div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col">
                    <div className="row">
                      <div className="col-lg-6 mb-4">
                        <div className="card text-white bg-primary shadow">
                          <div className="card-body">
                            <p className="m-0">TEXT</p>
                            <p className="text-white-50 small m-0">#4e73df</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card text-white bg-success shadow">
                          <div className="card-body">
                            <p className="m-0">TEXT</p>
                            <p className="text-white-50 small m-0">#1cc88a</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card text-white bg-info shadow">
                          <div className="card-body">
                            <p className="m-0">TEXT</p>
                            <p className="text-white-50 small m-0">#36b9cc</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card text-white bg-warning shadow">
                          <div className="card-body">
                            <p className="m-0">TEXT</p>
                            <p className="text-white-50 small m-0">#f6c23e</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card text-white bg-danger shadow">
                          <div className="card-body">
                            <p className="m-0">TEXT</p>
                            <p className="text-white-50 small m-0">#e74a3b</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <div className="card text-white bg-secondary shadow">
                          <div className="card-body">
                            <p className="m-0">TEXT</p>
                            <p className="text-white-50 small m-0">#858796</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            
            
            
            
            
            
            
            <footer className="bg-white sticky-footer">
              <div className="container my-auto">
                <div className="text-center my-auto copyright"><span>Copyright © Hívők 2020</span></div>
              </div>
            </footer>
          </div><a className="border rounded d-inline scroll-to-top" href="#page-top"><i className="fas fa-angle-up" /></a></div>
      </div>
    
  )
}

export  function Home() {
  const[session,loading]=useSession();
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
       
      </Head>

      <main className={styles.main}>

        {loading && <div className={styles.title}>Loading...</div>}
        
      
      </main>

      <footer className={styles.footer}>
      
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
