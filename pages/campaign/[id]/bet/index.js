import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useContractKit } from '@celo-tools/use-contractkit';
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { getETHPrice, getWEIPriceInUSD } from '../../../../lib/getETHPrice'
import {
  Heading,
  useColorModeValue,
  Text,
  Button,
  Tooltip,
  Tr,
  Td,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  Stack,
  Link,
  FormControl,
  FormLabel,
  Textarea,
  InputGroup,
  Input,
  InputRightAddon,
  Box
} from '@chakra-ui/react'
import {
  ArrowBackIcon,
  InfoIcon,
  CheckCircleIcon,
  WarningIcon
} from '@chakra-ui/icons'
import web3 from '../../../../smart-contract/web3'
import Campaign from '../../../../smart-contract/campaign'
import factory from '../../../../smart-contract/factory'

export async function getServerSideProps ({ params }) {
  const campaignId = params.id
  const campaign = Campaign(campaignId)
  const requestCount = await campaign.methods.getRequestsCount().call()
  const approversCount = await campaign.methods.approversCount().call()
  const summary = await campaign.methods.getSummary().call()
  const ETHPrice = await getETHPrice()

  return {
    props: {
      campaignId,
      requestCount,
      approversCount,
      balance: summary[1],
      name: summary[5],
      ETHPrice
    }
  }
}

const RequestRow = ({
  id,
  request,
  approversCount,
  campaignId,
  disabled,
  ETHPrice
}) => {
  const router = useRouter()
  const readyToFinalize = request.approvalCount > approversCount / 2
  const [errorMessageApprove, setErrorMessageApprove] = useState()
  const [loadingApprove, setLoadingApprove] = useState(false)
  const [errorMessageFinalize, setErrorMessageFinalize] = useState()
  const [loadingFinalize, setLoadingFinalize] = useState(false)
  const onApprove = async () => {
    setLoadingApprove(true)
    try {
      const campaign = Campaign(campaignId)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.approveRequest(id).send({
        from: accounts[0],
        gas: 210000
      })
      router.reload()
    } catch (err) {
      setErrorMessageApprove(err.message)
    } finally {
      setLoadingApprove(false)
    }
  }

  const onFinalize = async () => {
    setLoadingFinalize(true)
    try {
      console.log("THis shouldn't happen")
      const campaign = Campaign(campaignId)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0],
        gas: 210000
      })
      router.reload()
    } catch (err) {
      setErrorMessageFinalize(err.message)
    } finally {
      setLoadingFinalize(false)
    }
  }

  return (
    <Tr
      bg={
        readyToFinalize && !request.complete
          ? useColorModeValue('teal.100', 'teal.700')
          : useColorModeValue('gray.100', 'gray.700')
      }
      opacity={request.complete ? '0.4' : '1'}
    >
      <Td>{id} </Td>
      <Td>{request.description}</Td>
      <Td isNumeric>
        {web3.utils.fromWei(request.value, 'ether')}CUSD ($
        {getWEIPriceInUSD(ETHPrice, request.value)})
      </Td>
      <Td>
        <Link
          color='teal.500'
          href={`https://alfajores-blockscout.celo-testnet.org/address/${request.recipient}`}
          isExternal
        >
          {' '}
          {request.recipient.substr(0, 10) + '...'}
        </Link>
      </Td>
      <Td>
        {request.approvalCount}/{approversCount}
      </Td>
      <Td>
        <HStack spacing={2}>
          <Tooltip
            label={errorMessageApprove}
            bg={useColorModeValue('white', 'gray.700')}
            placement={'top'}
            color={useColorModeValue('gray.800', 'white')}
            fontSize={'1em'}
          >
            <WarningIcon
              color={useColorModeValue('red.600', 'red.300')}
              display={errorMessageApprove ? 'inline-block' : 'none'}
            />
          </Tooltip>
          {request.complete ? (
            <Tooltip
              label='This Request has been finalized & withdrawn to the recipient,it may then have less no of approvers'
              bg={useColorModeValue('white', 'gray.700')}
              placement={'top'}
              color={useColorModeValue('gray.800', 'white')}
              fontSize={'1em'}
            >
              <CheckCircleIcon
                color={useColorModeValue('green.600', 'green.300')}
              />
            </Tooltip>
          ) : (
            <Button
              colorScheme='yellow'
              variant='outline'
              _hover={{
                bg: 'yellow.600',
                color: 'white'
              }}
              onClick={onApprove}
              isDisabled={disabled || request.approvalCount == approversCount}
              isLoading={loadingApprove}
            >
              Approve
            </Button>
          )}
        </HStack>
      </Td>
      <Td>
        <Tooltip
          label={errorMessageFinalize}
          bg={useColorModeValue('white', 'gray.700')}
          placement={'top'}
          color={useColorModeValue('gray.800', 'white')}
          fontSize={'1em'}
        >
          <WarningIcon
            color={useColorModeValue('red.600', 'red.300')}
            display={errorMessageFinalize ? 'inline-block' : 'none'}
            mr='2'
          />
        </Tooltip>
        {request.complete ? (
          <Tooltip
            label='This Request has been finalized & withdrawn to the recipient,it may then have less no of approvers'
            bg={useColorModeValue('white', 'gray.700')}
            placement={'top'}
            color={useColorModeValue('gray.800', 'white')}
            fontSize={'1em'}
          >
            <CheckCircleIcon
              color={useColorModeValue('green.600', 'green.300')}
            />
          </Tooltip>
        ) : (
          <HStack spacing={2}>
            <Button
              colorScheme='green'
              variant='outline'
              _hover={{
                bg: 'green.600',
                color: 'white'
              }}
              isDisabled={disabled || (!request.complete && !readyToFinalize)}
              onClick={onFinalize}
              isLoading={loadingFinalize}
            >
              Finalize
            </Button>

            <Tooltip
              label='This Request is ready to be Finalized because it has been approved by 50% Approvers'
              bg={useColorModeValue('white', 'gray.700')}
              placement={'top'}
              color={useColorModeValue('gray.800', 'white')}
              fontSize={'1.2em'}
            >
              <InfoIcon
                as='span'
                color={useColorModeValue('teal.800', 'white')}
                display={
                  readyToFinalize && !request.complete ? 'inline-block' : 'none'
                }
              />
            </Tooltip>
          </HStack>
        )}
      </Td>
    </Tr>
  )
}

export default function Bet ({
  campaignId,
  requestCount,
  approversCount,
  balance,
  name,
  ETHPrice
}) {
  const router = useRouter()
  const { id } = router.query
  const [requestsList, setRequestsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [FundNotAvailable, setFundNotAvailable] = useState(false)
  const campaign = Campaign(campaignId)
  const [error, setError] = useState('')
  const [inUSD, setInUSD] = useState()
  const { connect, address, destroy } = useContractKit();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors }
  } = useForm({
    mode: 'onChange'
  })

  async function onSubmit (data) {
    console.log(data)
    const campaign = Campaign(id)
    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.refund().send({ from: accounts[0], gas: 210000 })

      router.push(`/campaign/${id}/requests`)
    } catch (err) {
      setError(err.message)
      console.log(err)
    }
  }

  return (
    <div>
      <Head>
        <title>Create a Withdrawal Request</title>
        <meta name='description' content='Create a Withdrawal Request' />
        <link rel='icon' href='/logo.svg' />
      </Head>
      <main>
        <Stack spacing={8} mx={'auto'} maxW={'2xl'} py={12} px={6}>
          <Text fontSize={'lg'} color={'teal.400'} justifyContent='center'>
            <ArrowBackIcon mr={2} />
            <NextLink href={`/campaign/${id}`}>Back to Campaign</NextLink>
          </Text>
          <Stack>
            <Heading fontSize={'4xl'}>Create a Refund Request</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl id='value'>
                  <FormLabel>Amount in CUSD you want to bet</FormLabel>
                  <InputGroup>
                    {' '}
                    <Input
                      {...register('value', { required: true })}
                      type='number'
                      step='any'
                      min='0'
                    />{' '}
                    <InputRightAddon children='CUSD' />
                  </InputGroup>
                </FormControl>
                <Stack spacing={10}>
                  <Stack spacing={3}>
                    <Button
                      color={'white'}
                      bg={'teal.400'}
                      _hover={{
                        bg: 'teal.300'
                      }}
                      type='submit'
                    >
                      Bet{' '}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </main>
    </div>
  )
}
