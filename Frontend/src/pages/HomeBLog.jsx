import React from 'react';
import BlogForm from '../pages/blogs';
const HomeBlog = () => {
    const homeStyle = {
        float: 'left',
        width: '70%',
        backgroundColor: '#fff',
        padding: '20px',
        margin: '20px 0',
        boxSizing: 'border-box',
    };
    return (
            <div style={homeStyle}>
                <h2>Welcome to Your Blog</h2>
                <p>This is a sample blog homepage. Customize it to suit your needs.</p>
             <BlogForm/>
            </div>
            
    );
};

export default HomeBlog;