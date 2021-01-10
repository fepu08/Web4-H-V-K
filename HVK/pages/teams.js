

import React from "react";
import { useSession, signIn, signOut } from 'next-auth/client';


export default function Teams() {
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
        <link rel="stylesheet" href="assets/css/Google-Style-Text-Input.css" />
        <link rel="stylesheet" href="assets/css/Multi-Select-Dropdown-by-Jigar-Mistry.css" />
        <link rel="stylesheet" href="assets/css/Navigation-with-Button.css" />
        <link rel="stylesheet" href="assets/css/NZDropdown---Muitlple.css" />
        <div id="wrapper">
          <div className="d-flex flex-column" id="content-wrapper">
            <div id="content">



            <nav className="navbar navbar-light navbar-expand-md navigation-clean-button">
                                <div className="container"><a className="navbar-brand" href="#">Hívők</a><button data-toggle="collapse" data-target="#navcol-2" className="navbar-toggler"><span className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
                                  <div className="collapse navbar-collapse" id="navcol-2">
                                    <ul className="nav navbar-nav mr-auto">
                                      <li className="nav-item"><a className="nav-link " href="/">Home</a></li>
                                      <li className="nav-item"><a className="nav-link " href="/profile">Profile</a></li>
                                      
                                      <li className="nav-item"><a className="nav-link active" href="/teams">Teams</a></li>
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
                  <h3 className="text-dark mb-0">Teams</h3>
                </div>
                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <div className="card shadow mb-4">
                      <div className="card-header py-3">
                        <h6 className="text-primary font-weight-bold m-0">Csapattagok</h6>
                      </div>
                      <div className="card-body">
                        <ul className="list-group">
                          <li className="list-group-item"><span>List Group Item 1</span></li>
                          <li className="list-group-item"><span>List Group Item 2</span></li>
                          <li className="list-group-item"><span>List Group Item 3</span></li>
                        </ul>
                      </div>
                    </div>
                    <div className="card shadow mb-4">
                      <div className="card-header py-3">
                        <h6 className="text-primary font-weight-bold m-0">Todo List</h6>
                      </div>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          <div className="row align-items-center no-gutters">
                            <div className="col mr-2">
                              <h6 className="mb-0"><strong>Lunch meeting</strong></h6><span className="text-xs">10:30 AM</span>
                            </div>
                            <div className="col-auto">
                              <div className="custom-control custom-checkbox"><input className="custom-control-input" type="checkbox" id="formCheck-1" /><label className="custom-control-label" htmlFor="formCheck-1" /></div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item">
                          <div className="row align-items-center no-gutters">
                            <div className="col mr-2">
                              <h6 className="mb-0"><strong>Lunch meeting</strong></h6><span className="text-xs">11:30 AM</span>
                            </div>
                            <div className="col-auto">
                              <div className="custom-control custom-checkbox"><input className="custom-control-input" type="checkbox" id="formCheck-2" /><label className="custom-control-label" htmlFor="formCheck-2" /></div>
                            </div>
                          </div>
                        </li>
                        <li className="list-group-item">
                          <div className="row align-items-center no-gutters">
                            <div className="col mr-2">
                              <h6 className="mb-0"><strong>Lunch meeting</strong></h6><span className="text-xs">12:30 AM</span>
                            </div>
                            <div className="col-auto">
                              <div className="custom-control custom-checkbox"><input className="custom-control-input" type="checkbox" id="formCheck-3" /><label className="custom-control-label" htmlFor="formCheck-3" /></div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card shadow mb-4">
                      <div className="card-header py-3">
                        <h6 className="text-primary font-weight-bold m-0">Csapattag Hozzáadása</h6>
                      </div>
                      <div className="card-body">
                        <div className="form-group"><input type="text" className="form-control" /></div><a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#" style={{marginBottom: '-10px', marginTop: '0px'}}><i className="fas fa-upload fa-sm text-white-50" />&nbsp; Add</a>
                      </div>
                    </div>
                    <div className="card shadow mb-4">
                      <div className="card-header py-3">
                        <h6 className="text-primary font-weight-bold m-0">Tag kirúgása</h6>
                      </div>
                      <div className="card-body"><select id="dates-field2" className="multiselect-ui form-control" multiple>
                          <option value={12} selected>This is item 1</option>
                          <option value={13}>This is item 2</option>
                          <option value={14}>This is item 3</option>
                        </select><a className="btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#" style={{margin: '0px', marginTop: '10px', marginBottom: '-10px'}}><i className="fas fa-trash-alt fa-sm text-white-50" />&nbsp; Kick</a></div>
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
          </div><a className="border rounded d-inline scroll-to-top" href="#page-top"><i className="fas fa-angle-up" /></a>
        </div>
      </div>
  )
}
