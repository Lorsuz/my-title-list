import React from 'react';
import Layout from '@layout/PagesLayout';
import styled from 'styled-components';

import Contact from '@component/containers/Home/Contact';
import HomeCover from '@component/containers/Home/Cover';
import SchoolNumbers from '@component/containers/Home/SchoolNumbers';

const HomePage: React.FunctionComponent = () => (
	<Layout title='Home Page' backgroundColor='#0B1127'>
		<StyledHomePage>
			<HomeCover />
			<SchoolNumbers />
			<Contact />
		</StyledHomePage>
	</Layout>
);

const StyledHomePage = styled.main`
	width: 100%;
	margin:0;
	padding:0;
	box-sizing:border-box;
`;

export default HomePage;
