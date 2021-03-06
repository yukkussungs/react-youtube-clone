import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions'
import { useSelector, useDispatch } from 'react-redux';

export default function (SpecificComponent, option, adminRoute = null) {
  //option -> null / true / false
  // null -> 아무나 출입이 가능함.
  // true -> 로그인한 유저만 출입이 가능함.
  // false -> 로그인한 유저는 출입 물가능한 페이지
  
  function AuthenticationCheck(props) {
      
      let user = useSelector(state => state.user);
      const dispatch = useDispatch();

      useEffect(() => {
        dispatch(auth()).then(response => {

          //로그인 하지 않은 상태
          if(!response.payload.isAuth) {
            if (option) {
              props.history.push('/login')
            }
          } else {
            //로그인 한 상태
            if (adminRoute && !response.payload.isAdmin) {
              props.history.push('/')
            } else {
              if (option === false) {
                props.history.push('/')
              }
            }
          }
        })
      }, [])

      return (
        <SpecificComponent {...props} user={user} />
      )
    }

    return AuthenticationCheck
}