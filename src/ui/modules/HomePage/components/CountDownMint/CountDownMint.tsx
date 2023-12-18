import { padStart } from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
interface CountDownMintProps {
  startTime: number
  endTime: number
  className?: string
  title: string
  setCountDownEnd?: () => void
}

const CountDownMint: React.FC<CountDownMintProps> = ({
  startTime,
  endTime,
  setCountDownEnd,
  className = '',
  title
}) => {
  let currentUtcUnixTime = moment.utc().unix()
  const [duration, setDuration] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [timeEnd, setTimeEnd] = useState(false)

  if (currentUtcUnixTime < startTime) {
    endTime = startTime
  } else if (
    currentUtcUnixTime >= startTime! &&
    currentUtcUnixTime <= endTime
  ) {
    currentUtcUnixTime = startTime
  }

  const addPadStartToTime = (time: number) => {
    if (!time) return '00'
    return padStart(time.toString(), 2, '0')
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    const updateCountdown = () => {
      const currentUtcUnixTime = Math.floor(Date.now() / 1000)
      const diff = endTime - currentUtcUnixTime

      if (diff <= 0) {
        clearInterval(interval!)
        setTimeEnd(true)

        if (setCountDownEnd) {
          setCountDownEnd()
        }
      } else {
        const days = Math.floor(diff / (60 * 60 * 24))
        const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60))
        const minutes = Math.floor((diff % (60 * 60)) / 60)
        const seconds = Math.floor(diff % 60)

        setDuration({ days, hours, minutes, seconds })
      }
    }

    interval = setInterval(updateCountdown, 1000)
    updateCountdown()

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [startTime, endTime])

  return (
    <div className={`count-down ${className}`}>
      {!timeEnd && endTime > 0 ? (
        <>
          <div className='title uppercase'>{title}</div>
          <div className='countdown uppercase'>
            {duration.days !== 0 && (
              <span>{addPadStartToTime(duration.days)}:</span>
            )}
            <span>{`${addPadStartToTime(duration.hours)}:`}</span>
            <span>{`${addPadStartToTime(duration.minutes)}:`}</span>
            <span>{addPadStartToTime(duration.seconds)}</span>
          </div>
        </>
      ) : (
        <div className='title uppercase'>Mint Ended</div>
      )}
    </div>
  )
}

export default CountDownMint
