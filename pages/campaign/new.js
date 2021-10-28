import React, { useState } from 'react'
import Head from 'next/head'
import { useAsync } from 'react-use'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputRightAddon,
  InputGroup,
  Alert,
  AlertIcon,
  AlertDescription,
  FormHelperText,
  Textarea
} from '@chakra-ui/react'
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import NextLink from 'next/link'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getETHPrice, getETHPriceInUSD } from '../../lib/getETHPrice'
import { useContractKit } from '@celo-tools/use-contractkit'

import CeloStarterByteCode from '../../smart-contract/build/CampaignFactoryABI.json'
import dotenv from "dotenv"

// LOAD ENV VAR
dotenv.config();

export default function NewCampaign () {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors }
  } = useForm({
    mode: 'onChange'
  })
  const router = useRouter()
  const [error, setError] = useState('')
  const { kit, connect, address, performActions } = useContractKit();
  const [minContriInUSD, setMinContriInUSD] = useState()
  const [targetInUSD, setTargetInUSD] = useState()
  const [ETHPrice, setETHPrice] = useState(0)
  const [dateTime, ] = useState(new Date())


  useAsync(async () => {
    try {
      const result = await getETHPrice()
      setETHPrice(result)
    } catch (error) {
      console.log(error)
    }
  }, [])

  async function onSubmit (data) {
    console.log(
      data.minimumContribution,
      data.campaignName,
      data.description,
      data.imageUrl,
      data.target
    )
    const getUnixTimeUtc =  Math.round(new Date(data.campaignLength).getTime() / 1000)
    console.log(getUnixTimeUtc);

    try {
      await performActions(async (k) => {
        console.log(k);
        const celoStarter = new k.web3.eth.Contract(CeloStarterByteCode, "0x40f3a4EBf95CE4A431cffA9803Fcb86f81Ff4ffD")
        console.log(
          k.web3.utils.toWei(data.minimumContribution, 'ether'),
          data.campaignName,
          data.description,
          data.imageUrl,
          k.web3.utils.toWei(data.target, 'ether'),
          getUnixTimeUtc 
        )
     
        await celoStarter.methods.createCampaign(
            k.web3.utils.toWei(data.minimumContribution, 'ether'),
            data.campaignName,
            data.description,
            data.imageUrl,
            k.web3.utils.toWei(data.target, 'ether'),
            getUnixTimeUtc 
          
        ).send({
          from: address,
        
          gasLimit: '10000000',
          gasPrice: k.web3.utils.toWei('1', 'gwei')
        })
        router.push('/')
      })

    } catch (err) {
      setError(err.message)
      console.log(err)
    }

    // try {
    //   await factory.methods
    //     .createCampaign(
    //       web3.utils.toWei(data.minimumContribution, 'ether'),
    //       data.campaignName,
    //       data.description,
    //       data.imageUrl,
    //       web3.utils.toWei(data.target, 'ether'),
    //       getUnixTimeUtc    
    //     )
    //     .send({
    //       from: address
    //     })

    //   router.push('/')
    // } catch (err) {
    //   setError(err.message)
    //   console.log(err)
    // }
  }

  return (
    <div>
      <Head>
        <title>New Campaign</title>
        <meta name='description' content='Create New Campaign' />
        <link rel='icon' href='/logo.svg' />
      </Head>
      <main>
        <Stack spacing={8} mx={'auto'} maxW={'2xl'} py={12} px={6}>
          <Text fontSize={'lg'} color={'teal.400'}>
            <ArrowBackIcon mr={2} />
            <NextLink href='/'> Back to Home</NextLink>
          </Text>
          <Stack>
            <Heading fontSize={'4xl'}>Create a New Campaign 📢</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl id='minimumContribution'>
                  <FormLabel>Minimum Contribution Amount</FormLabel>
                  <InputGroup>
                    {' '}
                    <Input
                      type='number'
                      step='any'
                      {...register('minimumContribution', { required: true })}
                      isDisabled={isSubmitting}
                      onChange={e => {
                        setMinContriInUSD(Math.abs(e.target.value))
                      }}
                    />{' '}
                    <InputRightAddon children='CUSD' />
                  </InputGroup>
                </FormControl>
                <FormControl id='campaignName'>
                  <FormLabel>Campaign Name</FormLabel>
                  <Input
                    {...register('campaignName', { required: true })}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl id='description'>
                  <FormLabel>Campaign Description</FormLabel>
                  <Textarea
                    {...register('description', { required: true })}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl id='imageUrl'>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    {...register('imageUrl', { required: true })}
                    isDisabled={isSubmitting}
                    type='url'
                  />
                </FormControl>
                <FormControl id='campaignLength'>
                  <FormLabel>Campaign Length</FormLabel>
                  <DateTimePickerComponent value={dateTime} 
                  {...register('campaignLength', { required: true })}
                  ></DateTimePickerComponent>
                </FormControl>
                <FormControl id='target'>
                  <FormLabel>Target Amount</FormLabel>
                  <InputGroup>
                    <Input
                      type='number'
                      step='any'
                      {...register('target', { required: true })}
                      isDisabled={isSubmitting}
                      onChange={e => {
                        setTargetInUSD(Math.abs(e.target.value))
                      }}
                    />
                    <InputRightAddon children='CUSD' />
                  </InputGroup>
                </FormControl>

                {error ? (
                  <Alert status='error'>
                    <AlertIcon />
                    <AlertDescription mr={2}> {error}</AlertDescription>
                  </Alert>
                ) : null}
                {errors.minimumContribution ||
                errors.name ||
                errors.description ||
                errors.imageUrl ||
                errors.target ? (
                  <Alert status='error'>
                    <AlertIcon />
                    <AlertDescription mr={2}>
                      {' '}
                      All Fields are Required
                    </AlertDescription>
                  </Alert>
                ) : null}
                <Stack spacing={10}>
                  {address ? (
                    <Button
                      bg={'teal.400'}
                      color={'white'}
                      _hover={{
                        bg: 'teal.500'
                      }}
                      isLoading={isSubmitting}
                      type='submit'
                    >
                      Create
                    </Button>
                  ) : (
                    <Stack spacing={3}>
                      <Button
                        color={'white'}
                        bg={'teal.400'}
                        _hover={{
                          bg: 'teal.300'
                        }}
                        onClick={connect}
                      >
                        Connect Wallet{' '}
                      </Button>
                      <Alert status='warning'>
                        <AlertIcon />
                        <AlertDescription mr={2}>
                          Please Connect Your Wallet First to Create a Campaign
                        </AlertDescription>
                      </Alert>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </main>
    </div>
  )
}
