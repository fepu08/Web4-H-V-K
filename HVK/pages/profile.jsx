import React from "react";
import { useSession, signIn, signOut } from 'next-auth/client';
export default function Profile(){
  const[session,loading]=useSession();

    return (
        <main>
          <div>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
        <title>Profile - Hívők</title>
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
                                      <li className="nav-item"><a className="nav-link " href="/">Home</a></li>
                                      <li className="nav-item"><a className="nav-link active" href="/profile">Profile</a></li>
                                      
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
                <h3 className="text-dark mb-4" style={{margin: '0px', marginTop: '10px'}}>Profile</h3>
                <div className="row mb-3">
                  <div className="col-lg-4">
                    
                      
                    <div className="card shadow mb-4">
                      <div className="card-header py-3">
                        <h6 className="text-primary font-weight-bold m-0">Progress</h6>
                      </div>
                      <div className="card-body text-center shadow" ><img className="rounded-circle mb-3 mt-4" style={{margin: "auto", display:"block"}} src="assets/img/dogs/image1.jpeg" width={160} height={160}  />
                        <h4 className="small font-weight-bold">Customer Database<span className="float-right">60%</span></h4>
                        <div className="progress progress-sm mb-3">
                          <div className="progress-bar bg-primary" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} style={{width: '60%'}}><span className="sr-only">60%</span></div>
                        </div>
                        <h4 className="small font-weight-bold">Account setup<span className="float-right">Complete!</span></h4>
                        <div className="progress progress-sm mb-3">
                          <div className="progress-bar bg-success" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100} style={{width: '100%'}}><span className="sr-only">100%</span></div>
                        </div>
                        <div className="mb-3"><button className="btn btn-primary btn-sm" type="button">Change Photo</button></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="row mb-3 d-none">
                      <div className="col">
                        <div className="card text-white bg-primary shadow">
                          <div className="card-body">
                            <div className="row mb-2">
                              <div className="col">
                                <p className="m-0">Peformance</p>
                                <p className="m-0"><strong>65.2%</strong></p>
                              </div>
                              <div className="col-auto"><i className="fas fa-rocket fa-2x" /></div>
                            </div>
                            <p className="text-white-50 small m-0"><i className="fas fa-arrow-up" />&nbsp;5% since last month</p>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="card text-white bg-success shadow">
                          <div className="card-body">
                            <div className="row mb-2">
                              <div className="col">
                                <p className="m-0">Peformance</p>
                                <p className="m-0"><strong>65.2%</strong></p>
                              </div>
                              <div className="col-auto"><i className="fas fa-rocket fa-2x" /></div>
                            </div>
                            <p className="text-white-50 small m-0"><i className="fas fa-arrow-up" />&nbsp;5% since last month</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="card shadow mb-3">
                          <div className="card-header py-3">
                            <p className="text-primary m-0 font-weight-bold">User Settings</p>
                          </div>
                          <div className="card-body">
                          <form>
                            <div className="form-row">
                                <div className="col">
                                  <div className="form-group"><label htmlFor="first_name"><strong>First Name</strong></label><input className="form-control" type="text" placeholder="John" name="first_name" /></div>
                                </div>
                                <div className="col">
                                  <div className="form-group"><label htmlFor="last_name"><strong>Last Name</strong></label><input className="form-control" type="text" placeholder="Doe" name="last_name" /></div>
                                </div>
                              </div>


                              <div className="form-row">
                                <div className="col">
                                  <div className="form-group"><label htmlFor="pet_name"><strong>Pet Name</strong></label><input className="form-control" type="text" placeholder="BÉÉLAA" name="petname" /></div>
                                </div>
                                <div className="col">
                                  <div className="form-group"><label htmlFor="fruit"><strong>Favourite Fruit</strong></label><input className="form-control" type="email" placeholder="Banana" name="fruit" /></div>
                                </div>
                              </div>
                              
                               
                              <div className="form-group"><button className="btn btn-primary btn-sm" type="submit">Save Settings</button></div>
                            </form>
                          </div>
                        </div>
                        <div className="card shadow">
                          <div className="card-header py-3">
                            <p className="text-primary m-0 font-weight-bold">Contact Settings</p>
                          </div>
                          <div className="card-body">
                            <form>
                              <div className="form-group"><label htmlFor="address"><strong>Address</strong></label><input className="form-control" type="text" placeholder="Sunset Blvd, 38" name="address" /></div>
                              <div className="form-row">
                                <div className="col">
                                  <div className="form-group"><label htmlFor="city"><strong>City</strong></label><input className="form-control" type="text" placeholder="Los Angeles" name="city" /></div>
                                </div>
                                <div className="col">
                                  <div className="form-group"><label htmlFor="country"><strong>Country</strong></label><input className="form-control" type="text" placeholder="USA" name="country" /></div>
                                </div>
                              </div>
                              <div className="form-group"><button className="btn btn-primary btn-sm" type="submit">Save&nbsp;Settings</button></div>
                            </form>
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
        </main>
      );



}

