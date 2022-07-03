import React ,{ useState, useEffect }from 'react';
import {Navbar, Container, Nav} from 'react-bootstrap';

function Header() {

    const level = sessionStorage.getItem("paygrade");
    const [url, setURL] = useState(level);

    useEffect(() => {
        console.log(level);
        if (level == 'level 1'){
            setURL('/employeeHome');
        } else if(level == 'level 2'){
            setURL('/supervisorHome');
        } else if (level == 'level 3'){
            setURL('/managerHome');
        } else if (level == 'level 4'){
            setURL('/hrHome');
        } else {
            setURL('/');
        }
    }, [level]);

    return(
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
            <Container>
                <Navbar.Brand href={url}>
                    <img
                    alt=""
                    src="favicon.ico"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    />{' '}
                Jupyter
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    <Nav.Link href="#">About</Nav.Link>
                    <Nav.Link href="/logout">Logout</Nav.Link>
                    </Nav>
                    <Nav>
                    <Nav.Link href="#">Contact Us</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;