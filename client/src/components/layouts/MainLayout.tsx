import React, { useEffect } from 'react';

import Head from '@partial/Head';
import Header from '@partial/Header';
import Footer from '@partial/Footer';

type Props = {
	children: React.ReactNode;
	title?: string;
};

const Layout: React.FunctionComponent<Props> = ({ children, title }: Props) => {
	useEffect(() => {
	}, []);
	return (
		<>
			<Head title={title} />
			<Header />
			{children}
			<Footer />
		</>
	);
};

export default Layout;
