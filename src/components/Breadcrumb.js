import React from 'react';
import { Link } from 'react-router-dom';

function Breadcrumb({ items }) {
    return (
        <nav className="mb-4">
            <ol className="list-reset flex">
                {items.map((item, index) => (
                    <li key={index} className={`flex ${index !== items.length - 1 ? 'mr-2' : ''}`}>
                        {index !== items.length - 1 ? (
                            <>
                                <Link to={item.href} className="text-gray-500 " >
                                    {item.label}
                                </Link>
                                <span className="ms-3">></span>
                            </>
                        ) : (
                            <span  className="text-blue-600 hover:underline">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export default Breadcrumb;
