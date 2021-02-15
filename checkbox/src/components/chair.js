import React, { Component } from 'react'
class Users extends Component {
    render() {
        const { users } = this.props;
        return (
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(user => {
                            const {id,name,email} = user;
                            return <User 
                                key = {id}
                                id = {id}
                                name={name}
                                email = {email}
                            />
                        })
                    }     
                </tbody>
            </table>
        );
    }
}