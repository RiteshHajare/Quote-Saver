import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Homepage() {
    const [user, setUser] = useState("");
    const [quote, setQuote] = useState("");
    const [like, setLike] = useState(false);
    const [userQuotes, setUserQuotes] = useState([]);

    useEffect(() => {

        axios.get("http://localhost:4000/getuser")
            .then((res) => {
                console.log(res.data);
                setUser(res.data.googleId);
                setUserQuotes(res.data.quotes);
            })
    }, [])

    function logout() {
        window.open("http://localhost:4000/logout", "_self");
    }

    function handleClick() {
        setLike(false);
        fetch("https://type.fit/api/quotes")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                const num = Math.floor(Math.random() * 1643) + 1;
                if (num < 1 || num > 1643) num = 2;
                setQuote(data[num]);
                // console.log(data[num]);
            });

    }

    function handleLike() {
        setLike(!like);
        setUserQuotes((prev) => {
            if (!userQuotes.includes(quote)) {
                axios.post("http://localhost:4000/setquote", { quote, user });
                return [...prev, quote]
            } else {
                const indexx = userQuotes.indexOf(quote);
                axios.post("http://localhost:4000/removequote", { quote, user });
                const newarr = userQuotes.filter((quotee, index) => {
                    return indexx != index;
                })
                return newarr;
            }

        })

    }

    function mapQuotes(quotee) {
        return (
            <div className="quote">
                <h3>{quotee.text}</h3>
                <small>{quotee.author}</small>
            </div>
        )
    }


    return (
        <div className='Homepage'>
            <nav>
                <button className='logout btn btn-primary' onClick={logout} >logout</button>
            </nav>
            <div className="bodyy">
                <button onClick={handleClick} className='btn btn-primary'>Generate Random Quote</button>
                {quote != "" &&
                    <div className="quote">
                        <h3>{quote.text}</h3>
                        <span onClick={handleLike}>{like ? <i class="fa-solid fa-heart"></i> : <i class="fa-regular fa-heart"></i>} </span>
                        <small>{quote.author}</small>
                    </div>
                }
                <div className="myquotes">
                    <h2>{userQuotes != [] && "Saved Status"}</h2>
                    <hr />
                    {userQuotes != [] && userQuotes.map(mapQuotes)}
                </div>
            </div>
        </div>
    )

}

export default Homepage