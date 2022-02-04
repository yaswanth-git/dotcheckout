import './App.css';
import React, { useEffect, useState } from 'react';
import searchIcon from "./assests/search.png";


function App() {
  const [number, setNumber] = useState('+91');
  const [postDetails, setPostDetails] = useState({});
  const [modalStage, setModalStage] = useState(0);
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [ticketsData, setTicketsData] = useState([]);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [search, setSearch] = useState('');
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const getOtp = async (e) => {
    e.preventDefault()
    try {
      const temp = await fetch(`http://sms.dotcheckout.com/bms/send?mobile=${number.slice(3)}`, {
        method: 'POST',
        redirect: 'follow'
      })
      const data = await temp.json()
      if (JSON.stringify(data).includes('success')) {
        setModalStage(1);
      }
    } catch (err) {
      console.log(err)
    }
  }
  const postTicket = async (e) => {
    e.preventDefault()
    try {
      const temp = await fetch('http://cms.dotcheckout.com/movies', {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify({
          "price_per_ticket": postDetails.cost,
          "show_time": postDetails.time,
          "show_date": postDetails.date,
          "listed_by_name": "raja",
          "movie_name": postDetails.name,
          "listed_by_contact": number,
          "description": "a",
          "theatre_location": postDetails.location,
          "no_of_tickets": postDetails.number
        })
      })
      setModalStage(0)
      setNumber('+91')
      setOtp('')
      setIsVerified(false)
      setPostDetails({})
      setShowSignupModal(false)
    } catch (err) {
      console.log(err)
    }
  }
  const verifyOtp = async (e) => {
    e.preventDefault()
    try {
      const temp = await fetch(`http://sms.dotcheckout.com/bms/verify?mobile=${number.slice(3)}&otp=${otp}`, {
        method: 'POST',
        redirect: 'follow'
      });
      const data = await temp.json()
      if (JSON.stringify(data).includes('success')) {
        setModalStage(2)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchTicketsData = async () => {
    const temp = await fetch('https://cms.dotcheckout.com/movies', {
      method: 'GET',
      redirect: 'follow'
    });
    const data = await temp.json(); http://sms.dotcheckout.com/bms/send?mobile=9642668068
    data.forEach((ticket) => {
      if (ticket.show_time) {
        ticket.show_time = ticket.show_time.split(':').slice(0, 2);
        if (ticket.show_time[0] > 12) {
          ticket.show_time[0] = ticket.show_time[0] - 12;
          ticket.show_time.push('PM')
        } else {
          ticket.show_time.push('AM')
        }
        ticket.show_time = ticket.show_time[0] + ':' + ticket.show_time[1] + ' ' + ticket.show_time[2];
      }
    });
    data.forEach((ticket) => {
      if (ticket.show_date) {
        ticket.show_date = ticket.show_date.split('-').slice(1, 3);
        ticket.show_date[0] = month[ticket.show_date[0] - 1];
        switch (parseInt(ticket.show_date) % 10) {
          case 1:
            ticket.show_date[1] = ticket.show_date[1] + 'st'
            break
          case 2:
            ticket.show_date[1] = ticket.show_date[1] + 'nd'
            break
          case 3:
            ticket.show_date[1] = ticket.show_date[1] + 'rd'
            break
          default:
            ticket.show_date[1] = ticket.show_date[1] + 'th'
        }
        ticket.show_date = ticket.show_date[1] + ' ' + ticket.show_date[0]
      }
    })
    setTicketsData(data);
  }
  useEffect(() => {
    fetchTicketsData()
  }, [])
  return (
    <div className="App">
      <div className="header">
        <div className="logo">Tic<span>X</span></div>
        <div className="search-bar">
          <input type='text' className="search" placeholder='Search by movie name' onChange={(e) => setSearch(e.target.value)} />
          <img src={searchIcon} width={20} height={20} className="search-icon" />
        </div>
        <div>
          <button className='sell-button' onClick={() => setShowSignupModal(true)}>+Sell Ticket</button>
        </div>
      </div>
      <div className='listing-table'>
        {ticketsData !== [] && (
          <table>
            <thead>
              <tr>
                <th>Name of the Movie</th>
                <th>Number of Tickets</th>
                <th>Theatre Location</th>
                <th>Price per Ticket</th>
                <th>Show Timings</th>
                <th>Contact Number</th>
              </tr>
            </thead>
            <tbody>
              {ticketsData.filter((ticket) => ticket.movie_name.includes(search)).map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.movie_name}</td>
                  <td>{ticket.no_of_tickets}</td>
                  <td>{ticket.theatre_location}</td>
                  <td>{ticket.price_per_ticket}</td>
                  <td>{ticket.show_date}, {ticket.show_time}</td>
                  <td><a className='link'>View Contact</a></td>
                  {/* <td>{ticket.listed_by_contact}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showSignupModal &&
        (<div className="back-drop"
          onClick={(e) => {
            if (e.currentTarget !== e.target) return
            setShowSignupModal(false)
          }}>
          <div className="modal-container">
            {modalStage === 0 && (
              <div className='modal-content'>
                <div className='title'>Tic<span>X</span></div>
                <form onSubmit={(e) => getOtp(e)} className='form'>
                  <div>Please enter your phone number</div>
                  <div><input type="numeric" value={number} onChange={(e) => setNumber(e.target.value)} /></div>
                  <div><button type='submit'>GET OTP</button></div>
                </form>
              </div>
            )}
            {modalStage === 1 && (
              <div className='modal-content'>
                <div className='title'>Tic<span>X</span></div>
                <form onSubmit={(e) => verifyOtp(e)} className='form'>
                  <div>Verify OTP</div>
                  <div><input type="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} /></div>
                  <div><button type='submit'>verify OTP</button></div>
                </form>
              </div>
            )}
            {modalStage === 2 && (
              <div className='modal-content ticket-modal'>
                <h3>Add movie ticket listing</h3>
                <form className='form' onSubmit={(e) => postTicket(e)}>
                  <div>Movie Name</div>
                  <div><input type="text" value={postDetails.name} onChange={(e) => setPostDetails((pre) => {
                    pre.name = e.target.value
                    return pre
                  })
                  } /></div>
                  <div>Number of tickets</div>
                  <div><input type='numeric' value={postDetails.number} onChange={(e) => setPostDetails((pre) => {
                    pre.number = e.target.value
                    return pre
                  })} /></div>
                  <div>Price of each ticket</div>
                  <div><input type='numeric' value={postDetails.cost} onChange={(e) => setPostDetails((pre) => {
                    pre.cost = e.target.value
                    return pre
                  })} /></div>
                  <div>Add Image</div>
                  <div><input type='image' value={postDetails.img} onChange={(e) => setPostDetails((pre) => {
                    pre.img = e.target.value
                    return pre
                  })} /></div>
                  <div>Theatre Location</div>
                  <div><input type='text' value={postDetails.location} onChange={(e) => setPostDetails((pre) => {
                    pre.location = e.target.value
                    return pre
                  })} /></div>
                  <div className='time-date-wrapper'>
                    <div>
                      <div>Show Date</div>
                      <div><input type='date' value={postDetails.date} onChange={(e) => setPostDetails((pre) => {
                        pre.date = e.target.value
                        return pre
                      })} /></div>
                    </div>
                    <div>
                      <div>Show Time</div>
                      <div><input type='time' value={postDetails.time} onChange={(e) => setPostDetails((pre) => {
                        pre.time = e.target.value
                        return pre
                      })} /></div>
                    </div>
                  </div>
                  <div className='action-wrapper'>
                    <button className='cancel-button' onClick={() => {
                      setModalStage(0)
                      setShowSignupModal(false)
                    }}>CANCEL</button>
                    <button type='submit'>POST</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>)}
    </div>
  );
}

export default App;
