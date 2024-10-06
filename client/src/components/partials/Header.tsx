import React from 'react';
import { NavLink } from 'react-router-dom';
// import LogoPng from '@image/Logo/santa-cruz-logo-removebg-preview.png';
import styled from 'styled-components';
// import { RxHamburgerMenu } from 'react-icons/rx';
// import LogoWritten from '@image/Logo/logo_written.png';
import ButtonOpenProfile from '@component/ButtonOpenProfile';

const Header: React.FunctionComponent = () => {
	return (
		<>
			<StyledComponent>
				<div className='wrapper'>
					<article className='top'>
						<section className='logo'>
							{/* <img src={LogoPng} alt='' className='img' /> */}
							{/* <img src={LogoWritten} alt='' className='words' /> */}
						</section>
						<ButtonOpenProfile />
					</article>
				</div>
			</StyledComponent>
		</>
	);
};

const StyledComponent = styled.header`
	width: 100vw;
	top: 0;
	left: 0;
	background: rgba(255, 255, 255, 0.95);
	z-index: 100;

	.wrapper {
		row-gap: 15px;
		padding: 0 0 20px;

		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			grid-column: 2 / 12;
			padding: 20px 0 0px;

			section {
				&.logo {
					display: flex;
					align-items: center;
					justify-content: center;

					img.img {
						width: 70px;
					}
					img.words {
						width: 220px;
					}
				}
			}
		}
	}

	@media screen {
		@media (max-width: 950px) {
			.wrapper {
				.nav-bar {
					button {
						display: block;
					}

					nav {
						&.menu-desk {
							display: none;

							&.menu-mobile {
							}
						}
					}
				}
			}
		}
	}
`;

export default Header;
