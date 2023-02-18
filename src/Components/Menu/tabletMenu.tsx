import React from "react"
import AddressButton from "./AddressButton/addressButton"
import Navbar from "../Navbar/navbar"
import NavBarButton from "../Navbar/navBarButton"
import NavbarLink from "../Navbar/navBarLink"
import NavBarLinks from "../Navbar/navBarLinks"
import NavbarLogo from "../Navbar/navbarLogo"
import NavbarMobile from "../Navbar/navbarMobile"
import NavBarRight from "../Navbar/navBarRight"
import ThemeSwitch from "../Navbar/themeSwitch"
import NetworkButton from "./NetworkButton/networkButton"
import { useUiContext } from "../../Types/uiContext"

const TabletMenu: React.FC = () => {
    const {isTablet, isMobile, show} = useUiContext()

    return(
        ((isTablet || isMobile) && show) ? 
        (<>
            <Navbar isMobile={isMobile} isTablet={isTablet}>
                <NavbarLogo/>
                    <NavBarRight>
                    {isTablet && !isMobile ?
                        <>
                            <NetworkButton/>
                            <AddressButton />
                        </>
                    : null}
                            <ThemeSwitch/>
                            <NavBarButton/>
                    </NavBarRight>
            </Navbar>
            <NavbarMobile>
            {isMobile ? 
                <NavBarRight className="navbar-right-content">
                    <NetworkButton />
                    <AddressButton />
                </NavBarRight>
            : null}
            <NavBarLinks>
                 <NavbarLink link="https://docs.hundred.finance" target="_blank">Docs</NavbarLink>
             </NavBarLinks>
        </NavbarMobile>
        </>
        )
        : null
    )
} 

export default TabletMenu
